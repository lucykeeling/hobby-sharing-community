import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const CreatePost = () => {
    const [title, setTitle] = React.useState('');
    const [category, setCategory] = React.useState('');
    const [categories, setCategories] = React.useState([]);
    const [description, setDescription] = React.useState('');
    const [image, setImage] = React.useState(null);
    const [error, setError] = React.useState('');

    const { user } = useAuth();
    const navigate = useNavigate();

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
            ['link', 'image'],
            ['clean']
        ],
    };

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image'
    ];

    React.useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axiosInstance.get('/api/categories');
                    setCategories(response.data);
            } catch (err) {
                setError('Could not load categories');
            }
        };

        fetchCategories();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!user) {
            setError('You must be logged in to create a post');
            return;
        }

        const postData = new FormData();
        postData.append('title', title);
        postData.append('category', category);
        postData.append('description', description);
        postData.append('image', image);

        try {
            await axiosInstance.post('/api/posts/create', postData, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Could not create post');
        }
    };

    return (
        <section className="create_post">
            <div className="container">
                <h2> Create Post </h2>
                {error && <p className="form_error-message">{error}</p>}
                <form onSubmit={handleSubmit} className="form create-post_form">
                    <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} autoFocus />
                    <select name="category" value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value =""> Select a category </option>
                        {categories.map((cat) => (<option key={cat._id} value={cat._id}>{cat.Category_name}</option>
                        ))}
                    </select>
                    <ReactQuill modules={modules} formats={formats} value={description} onChange={setDescription} placeholder="Description" className="q1-editor" />
                    <input type="file" onChange={(e) => setImage(e.target.files[0])} accept="image/png, image/jpeg" />
                    <button type="submit" className="btn primary">Create Post</button>
                </form>
            </div>
        </section>
    )
}
export default CreatePost;

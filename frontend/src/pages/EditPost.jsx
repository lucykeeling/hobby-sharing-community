import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';

const EditPost = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState([]);
    const [categories, setCategories] = useState([]);
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [currentImage, setCurrentImage] = useState('');
    const [error, setError] = useState('');

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

    // Load the existing post into the form
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axiosInstance.get(`/api/posts/${id}`);
                setTitle(response.data.title);
                setCategory(response.data.category?._id || response.data.category);
                setDescription(response.data.description);
                setCurrentImage(response.data.image);
            } catch (err) {
                console.error('Failed to fetch post', err);
                setError('Could not load post');
            }
        };
        fetchPost();
    }, [id]);

    // Send the changes to the backend
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!user) {
            setError('You must be logged in to edit a post');
            return;
        }

        const postData = new FormData();
        postData.append('title', title);
        postData.append('category', category);
        postData.append('description', description);
        if (image) {
            postData.append('image', image);
        }

        try {
            await axiosInstance.put(`/api/posts/${id}`, postData, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            navigate(`/post/${id}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Could not edit post');
        }
    };

    return (
        <section className="create_post">
            <div className="container">
                <h2> Edit Post </h2>
                {error && <p className="form_error-message">{error}</p>}
                <form onSubmit={handleSubmit} className="form create-post_form">
                    <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} autoFocus />
                    <select name="category" value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value =""> Select a category </option>
                        {categories.map((cat) => (<option key={cat._id} value={cat._id}>{cat.Category_name}</option>
                        ))}
                    </select>
                    <ReactQuill modules={modules} formats={formats} value={description} onChange={setDescription} placeholder="Description" className="q1-editor" />
                    {currentImage && (
                        <img src={`${API_URL}/uploads/${currentImage}`} alt={title} style={{ maxWidth: '200px' }} />
                    )}
                    <input type="file" onChange={(e) => setImage(e.target.files[0])} accept="image/png, image/jpeg" />
                    <button type="submit" className="btn primary">Update</button>
                </form>
            </div>
        </section>
    );
};

export default EditPost;

import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const CreatePost = () => {
    const [title, setTitle] = React.useState('');
    const [category, setCategory] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [image, setImage] = React.useState('');

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

const Post_CATEGORIES = ['Gardening', 'Crochet', 'Exercise', 'Chess', 'Collecting', 'Cooking', 'Music', 'Travel', 'Drawing', 'DIY'];
    
    
    return (
        <section className="create_post">
            <div className="container">
                <h2> Create Post </h2>
                <p className="form_error-message">
                    This is an error message.
                </p>
                <form action="" className="form create-post_form">
                    <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} autoFocus />
                    <select name="category" value={category} onChange={(e) => setCategory(e.target.value)}>
                        {
                            Post_CATEGORIES.map((category, index) => <option key={index} value={category}>{category}</option>)
                        }
                    </select>
                    <ReactQuill modules={modules} formats={formats} value={description} onChange={setDescription} placeholder="Description" className="q1-editor" />
                    <input type="file" placeholder="Image" value={image} onChange={(e) => setImage(e.target.files[0])} accept='png, jpg, jpeg' />
                    <button type="submit" className="btn primary">Create Post</button>
                </form>
            </div>
        </section>
    )
}
export default CreatePost;

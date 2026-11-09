import React, { useEffect, useState } from 'react';
import PostAuthor from '../components/PostAuthor';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';


const PostDetail = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const { user } = useAuth();
    const navigate = useNavigate();
 

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axiosInstance.get(`/api/posts/${id}`);
                setPost(response.data);
            } catch (error) {
                console.error('Failed to fetch post', error);
            }
        };
        fetchPost();
    }, [id]);
    
    const handleDelete = async () => {
        if (!window.confirm('Delete this post? This cannot be undone.')) {
        return;
        }
        try {
        await axiosInstance.delete(`/api/posts/${id}`, {
            headers: { Authorization: `Bearer ${user.token}` },
        });
        navigate('/dashboard');
        } catch (error) {
        alert(error.response?.data?.message || 'Could not delete post');
    }
    };

    if (!post) {
        return <h2 className="center">Loading...</h2>;
    }
    
        const isOwner = user && post && user.id === post.creator?._id;

    return (
        <section className="post-detail">
            <div className="container post-detail_container">
                <div className="post-detail_header">
                    <PostAuthor creator={post.creator} createdAt={post.createdAt} />
                    <div className="post-detail_buttons">
                        <button onClick={() => navigate(-1)} className="btn sm primary">Back</button>

                        {isOwner && (
                            <>
                                <Link to={`/post/${id}/edit`} className="btn sm primary">Edit</Link>
                                <button onClick={handleDelete} className="btn sm danger">Delete</button>
                            </>
                        )}
                    </div>
                </div>
                <h1>{post.title}</h1>
                <div className="post-detail_image">
                    <img src={`http://localhost:5001/uploads/${post.image}`} alt={post.title} />
                </div>
                <div dangerouslySetInnerHTML={{ __html: post.description }} />
            </div>
        </section>
    );
};

     export default PostDetail;
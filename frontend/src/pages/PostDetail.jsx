import React, { useEffect, useState } from 'react';
import PostAuthor from '../components/PostAuthor';
import { Link, useParams } from 'react-router-dom';
import axiosInstance from '../axiosConfig';

const PostDetail = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);

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

    if (!post) {
        return <h2 className="center">Loading...</h2>;
    }

    return (
        <section className="post-detail">
            <div className="container post-detail_container">
                <div className="post-detail_header">
                    <PostAuthor />
                    <div className="post-detail_buttons">
                        <Link to={`/post/${id}/edit`} className="btn sm primary">Edit</Link>
                        <Link to={`/post/${id}/delete`} className="btn sm danger">Delete</Link>
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

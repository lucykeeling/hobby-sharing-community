import React from 'react';
import PostAuthor from '../components/PostAuthor';
import { Link, useParams } from 'react-router-dom';
import image from '../images/post_image.png';


const PostDetail = () => {
const {id} = useParams();
    return (
        <section className="post-detail">
            <div className="container post-detail_container">
             <div className="post-detail_header">
                <PostAuthor/>
                <div className="post-detail_buttons">
                    <Link to={`/post/${id}/edit`} className="btn sm primary">Edit</Link>
                    <Link to={`/post/${id}/delete`} className="btn sm danger">Delete</Link>
                </div>
             </div>
             <h1> This is the post title!</h1>
             <div className="post-detail_image">
             <img src={image} alt="Post Image" />
             </div>
             <p>
                This is the description of the post. It provides detailed information about the content of the post, including any relevant context, background, or additional details that may be useful for the reader. The description can be as long or as short as necessary to convey the intended message effectively.
             </p>

                </div>   

        </section>
    )
}

export default PostDetail;
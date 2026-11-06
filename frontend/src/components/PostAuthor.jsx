import React from 'react';
import { Link } from 'react-router-dom';
import Avatar from '../images/avatar.png';

const PostAuthor = () => {
    return (
        <Link to={`/posts/authors/name`} classname post_author>
            <div className="post_author-avatar">
            <img src={Avatar} alt="" />
            </div>
            <div className="post_author-details">
                <h5>By: Lucy Keeling</h5>
                <small>Just now</small>
            </div>
        </Link>
    )
}
export default PostAuthor

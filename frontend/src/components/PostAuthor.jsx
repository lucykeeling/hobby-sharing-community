import React from 'react';
import Avatar from '../images/avatar.png';
import { API_URL } from '../config';

const PostAuthor = ({ creator, createdAt }) => {
    return (
        <div className="post_author">
            <div className="post_author-avatar">
            <img src={
                creator?.profileImage ? `${API_URL}/uploads/${creator.profileImage}` : Avatar    
                
            } alt="" />
            </div>
            <div className="post_author-details">
                <h5>By: {creator?.name || 'Unknown'}</h5>
                <small>{createdAt ? new Date(createdAt).toLocaleString() : 'Unknown Date'}</small>
            </div>
        </div>
    )
}
export default PostAuthor

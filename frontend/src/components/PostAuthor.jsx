import React from 'react';
import Avatar from '../images/avatar.png';
import { API_URL } from '../config';

const PostAuthor = ({ creator, createdAt, avatarVersion }) => {
    return (
        <div className="post_author">
            <div className="post_author-avatar">
            <img
                src={creator?._id ? `${API_URL}/api/user/user-image/${creator._id}?t=${avatarVersion} || ''}` : Avatar}
                onError={(e) => { e.target.onerror = null; e.target.src = Avatar; }}
                alt=""
            />
            </div>
            <div className="post_author-details">
                <h5>By: {creator?.name || 'Unknown'}</h5>
                <small>{createdAt ? new Date(createdAt).toLocaleString() : 'Unknown Date'}</small>
            </div>
        </div>
    )
}
export default PostAuthor

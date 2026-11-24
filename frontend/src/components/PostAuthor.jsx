import React from 'react';
import Avatar from '../images/avatar.png';
import { API_URL } from '../config';
import { Link } from 'react-router-dom';

const PostAuthor = ({ creator, createdAt, avatarVersion }) => {
    const profilePath = creator?._id ? `/profile/${creator._id}` : null;

    const avatar = (
        <img
            src={creator?._id ? `${API_URL}/api/user/user-image/${creator._id}?t=${avatarVersion}` : Avatar}
            onError={(e) => { e.target.onerror = null; e.target.src = Avatar; }}
            alt=""
        />
    );
    const name = <h5>By: {creator?.name || 'Unknown'}</h5>;

    return (
        <div className="post_author">
            <div className="post_author-avatar">
                {profilePath ? <Link to={profilePath}>{avatar}</Link> : avatar}
            </div>
            <div className="post_author-details">
                {profilePath ? <Link to={profilePath}>{name}</Link> : name}
                <small>{createdAt ? new Date(createdAt).toLocaleString() : 'Unknown Date'}</small>
            </div>
        </div>
    )
}

export default PostAuthor

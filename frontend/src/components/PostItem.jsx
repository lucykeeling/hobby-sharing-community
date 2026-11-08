import React from 'react'
import { Link } from 'react-router-dom'
import PostAuthor  from './PostAuthor'

const PostItem = ({ postID, category, title, description, creatorID, image }) => {
    const shortDescription = description.length > 145 ? description.substring(0, 145) + '...' : description;
    const postTitle = title.length > 30 ? title.substring(0, 30) + '...' : title;
    return (
        <article className="post">
           <div className="post_image">
            <img src={image} alt={title} />
            </div>
            <div className="post_content">
            <Link to={`/post/${postID}`}> 
            <h3>{postTitle}</h3> 
            </Link>
            <div dangerouslySetInnerHTML={{ __html: shortDescription }} />
            <div className="post_footer">
                <PostAuthor />
                <Link to={`/search?q=${encodeURIComponent(category)}`} className="btn category">
                    {category}
                </Link>
            </div>
            </div>
        </article>
    )
}

export default PostItem

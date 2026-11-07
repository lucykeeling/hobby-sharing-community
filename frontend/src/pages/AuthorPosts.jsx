import React from 'react';
import PostItem from '../components/PostItem';

const AuthorPosts = () => {
    const [posts, setPosts] = React.useState([]);
    return (
                <section className="author_posts">
            {posts.length > 0 ? <div className="container post_container">
                    {
                        posts.map(({id, title, description, image, author, date, category}) => <PostItem key={id} postID={id} title={title} description={description} image={image} author={author} date={date} category={category} />              )
                }
            </div> : <h2 className='center'>No posts available.</h2>}
        </section>
    )
}


export default AuthorPosts;
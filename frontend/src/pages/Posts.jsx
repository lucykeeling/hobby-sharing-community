import React from 'react';
import PostItem from '../components/PostItem';
import axiosInstance from '../axiosConfig'

const Posts = () => {
    const [posts, setPosts] = React.useState([]);

    React.useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axiosInstance.get('/api/posts/all');
                setPosts(response.data);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };
        fetchPosts();
    }, []);

    return (
        <section className="post">
            {posts.length > 0 ? <div className="container post_container">
                    {
                        posts.map(({_id, title, description, image, creator, date, category}) => 
                        <PostItem 
                        key={_id} 
                        postID={_id} 
                        title={title} 
                        description={description} 
                        image={`http://localhost:5001/uploads/${image}`}
                        creator={creator?._id} 
                        date={date} 
                        category={category} />              )
                }
            </div> : <h2 className='center'>No posts available.</h2>}
        </section>
    )
}
export default Posts;

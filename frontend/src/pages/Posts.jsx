import React from 'react';
import PostItem from '../components/PostItem';
import axiosInstance from '../axiosConfig'
import { API_URL } from '../config';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';


const Posts = () => {
    const { user } = useAuth();
    const [posts, setPosts] = React.useState([]);

React.useEffect(() => {
    if (!user) return;
  const fetchPosts = async () => {
    const response = await axiosInstance.get('/api/posts/all', {
      headers: { Authorization: `Bearer ${user.token}` },
    });
    setPosts(response.data);
  };
  fetchPosts();
}, [user]);

if (!user) return <Navigate to="/login" />;


    return (
        <section className="category_posts">
            {posts.length > 0 ? <div className="container post_container">
                    {
                        posts.map(({_id, title, description, image, creator, createdAt, category}) => 
                        <PostItem 
                        key={_id} 
                        postID={_id} 
                        title={title} 
                        description={description} 
                        image={`${API_URL}/uploads/${image}`}
                        creator={creator} 
                        createdAt={createdAt} 
                        category={category} />              )
                }
            </div> : <h2 className='center'>No posts available.</h2>}
        </section>
    )
}
export default Posts;

import React from 'react';
import { Link , useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';


const Dashboard = () => {
    const [posts, setPosts] = React.useState([]);
    const { user } = useAuth();
    const navigate = useNavigate();
    
    React.useEffect(() => {
        const fetchUserPosts = async () => {
            try {
                const response = await axiosInstance.get(`/api/posts/user`, {
                    headers: { Authorization: `Bearer ${user.token}` },
                });
                setPosts(response.data);
            } catch (error) {
                console.error('Error fetching user posts:', error);
            }
        };
        if (user)  fetchUserPosts();
    }, [user]);
        const handleDelete = async (postId) => {
            if (!window.confirm('Are you sure you want to delete this post?')) {
                return;
            }
            try {
                await axiosInstance.delete(`/api/posts/${postId}`, {
                    headers: { Authorization: `Bearer ${user.token}` },
                });

                setPosts(posts.filter(post => post._id !== postId));
                alert('Post deleted successfully');
            } catch (error) {
                console.error('Error deleting post:', error);
                alert(error.response?.data?.message || 'Unable to delete post');
            }       
        };

    return (
        <section className="dashboard">
            {
                posts.length ? <div className="container dashboard_container">
                    {
                        posts.map (post => {
                            return <article key={post._id} className="dashboard_post">
                                <div className="dashboard_post-info">
                                <div className="dashboard_post-image">
                                    <img src={`${API_URL}/uploads/${post.image}`} alt={post.title} />
                                    </div>
                                <h5>{post.title}</h5>
                                </div>
                            <div className="dashboard_post-actions">
                           <span className={`status-pill status-pill--${post.postStatus}`}
                                title={post.postStatus === 'rejected' ? post.rejectionReason : undefined}>
                                    {post.postStatus}
                            </span>
                            <Link to ={`/post/${post._id}`} className="btn sm">View</Link>
                            <Link to ={`/post/${post._id}/edit`} className="btn sm primary">Edit</Link>
                            <button onClick={() => handleDelete(post._id)} className="btn sm danger"> Delete </button>
                             </div>
                            </article>
                    })
            }
                </div> : <h2 className='center'>You have no posts yet.</h2>
            }
        </section>
    )
}
export default Dashboard;

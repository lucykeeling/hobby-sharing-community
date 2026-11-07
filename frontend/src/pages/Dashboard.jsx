import React from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const [posts, setPosts] = React.useState([]);
    const { user } = useAuth();
    
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

    return (
        <section className="dashboard">
            {
                posts.length ? <div className="container dashboard_container">
                    {
                        posts.map (post => {
                            return <article key={post._id} className="dashboard_post">
                                <div className="dashboard_post-info">
                                <div className="dashboard_post-image">
                                    <img src={`http://localhost:5001/uploads/${post.image}`} alt={post.title} />
                                    </div>
                                <h5>{post.title}</h5>
                                </div>
                            <div className="dashboard_post-actions">
                            <Link to ={`/post/${post._id}`} className="btn sm">View</Link>
                            <Link to ={`/post/${post._id}/edit`} className="btn sm primary">Edit</Link>
                            <Link to ={`/post/${post._id}/delete`} className="btn sm danger">Delete</Link>
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

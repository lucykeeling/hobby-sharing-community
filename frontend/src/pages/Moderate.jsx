import React from 'react';
import { Link , useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const Moderate = () => {
    const { user } = useAuth();
    
    if (!user) {
        return (
            <h2 className= 'center'>
                Please <Link to ="/login">Log in</Link> to access this page.
            </h2>
        );
    }
    if (user.role !== 'Admin') {
        return <h2 className='center'>You do not have permission to access this page.</h2>;
    }
    return <ModeratePosts />;   
};

const ModeratePosts = () => {
    const [posts, setPosts] = React.useState([]);
    const { user } = useAuth();
    const navigate = useNavigate();
    
    React.useEffect(() => {
        const fetchUserPosts = async () => {
            try {
                const response = await axiosInstance.get(`/api/posts/pending`, {
                    headers: { Authorization: `Bearer ${user.token}` },
                });
                setPosts(response.data);
            } catch (error) {
                console.error('Error fetching user posts:', error);
            }
        };
        if (user)  fetchUserPosts();
    }, [user]);


        const handleModerate = async (postId, status) => {
            try {
            const response = await axiosInstance.put(
            `/api/posts/${postId}/moderate`, { postStatus: status }, {
            headers: { Authorization: `Bearer ${user.token}` },
            });
            setPosts(posts.filter(post => post._id !== postId));
            } catch (error) {
            console.error('Error moderating post:', error);
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
                                    <img src={`http://localhost:5001/uploads/${post.image}`} alt={post.title} />
                                    </div>
                                <h5>{post.title}</h5>
                                </div>
                            <div className="dashboard_post-actions">
                            <Link to ={`/post/${post._id}`} className="btn sm">View</Link>
                            <button onClick={() => handleModerate(post._id, 'approved')} className="btn sm primary">Approve</button>
                            <button onClick={() => handleModerate(post._id, 'rejected')} className="btn sm danger">Reject</button>

                             </div>
                            </article>
                    })
            }
                </div> : <h2 className='center'>You have no posts yet.</h2>
            }
        </section>
    )
}

export default Moderate;

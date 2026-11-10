import React from 'react';
import { Link , useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const REJECT_REASONS = [
    "Inappropriate content",
    "Spam or misleading information",
    "Violates community guidelines",
    "Offensive language or hate speech",
    "Copyright infringement",
    "Low-quality image or content",
    "Advertising or promotional content",
]


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
    const [rejectingPost, setRejectingPost] = React.useState(null);
    const [reason, setReason] = React.useState('');
    
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


        const handleModerate = async (postId, status, rejectionReason) => {
            try {
             await axiosInstance.put(
            `/api/posts/${postId}/moderate`, { postStatus: status, rejectionReason }, 
            {headers: { Authorization: `Bearer ${user.token}` },
            });
            setPosts(posts.filter(post => post._id !== postId));
            alert (status === 'approved' ? 'Post approved successfully' : 'Post rejected successfully');
            } catch (error) {
            console.error('Error moderating post:', error);
            }
        };

        const confirmReject = async() => {
            if (!reason) return;
            await handleModerate(rejectingPost._id, 'rejected', reason);
            closeModal();
        };

        const closeModal = () => {
            setRejectingPost(null);
            setReason('');
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
                            <button onClick={() => setRejectingPost(post)} className="btn sm danger">Reject</button>
                            
                            {rejectingPost && (
                                    <div className="modal-overlay" onClick={closeModal}>
                                        <div className = "modal" onClick={(e) => e.stopPropagation()}>
                                            <h3>Reject Post "{rejectingPost.title}"</h3>
                                            <label htmlFor="reason">Select a reason for rejection:</label>
                                            <select id="reason" value={reason} onChange={(e) => setReason(e.target.value)}>
                                                <option value="">Select a reason</option>
                                                {REJECT_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
                                                </select>
                                                <div className="modal-actions">
                                                <button onClick={closeModal} className="btn sm">Cancel</button>
                                                <button className="btn sm danger" onClick={confirmReject} disabled={!reason}>Confirm Rejection</button>
                                                </div>
                                        </div>
                                        </div>
                                )}
                                            </div>
                                </article>
                    })
            }
                </div> : <h2 className='center'>You are up to date!</h2>
            }
        </section>
    )
}

export default Moderate;

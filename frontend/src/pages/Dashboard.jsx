import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [posts, setPosts] = React.useState([]);
    return (
        <section className="dashboard">
            {
                posts.length ? <div className="container dashboard_container">
                    {
                        posts.map (post => {
                            return <article key={post.id} className="dashboard_post">
                                <div className="dashboard_post-info"></div>
                                <div className="dashboard_post-image"></div>
                                    <img src={post.image} alt={post.title} />
                                <h5>{post.title}</h5>
                            <div className="dashboard_post-actions"></div>
                            <Link to ={`/post/${post.id}`} className="btn sm">View</Link>
                            <Link to ={`/post/${post.id}/edit`} className="btn sm primary">Edit</Link>
                            <Link to ={`/post/${post.id}/delete`} className="btn sm danger">Delete</Link>
                            </article>
                    })
            }
                </div> : <h2 className='center'>You have no posts yet.</h2>
            }
        </section>
    )
}
export default Dashboard;

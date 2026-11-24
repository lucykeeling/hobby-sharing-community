const PostStats = ({ postsCount}) => {
if (postsCount === undefined || postsCount === null) 
        return null; // Return null if postsCount is not provided

    return (
        <div className="profile_post_stats bg-white p-4 rounded shadow-md mb-2">    
            <div className="post-count">
                <h3>{postsCount}</h3>
                <p>Posts</p>
            </div>
        </div>
    );
};

export default PostStats;

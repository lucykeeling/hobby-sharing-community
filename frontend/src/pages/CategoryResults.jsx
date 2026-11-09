import React from 'react';
import PostItem from '../components/PostItem';
import axiosInstance from '../axiosConfig';
import { useParams } from 'react-router-dom';
import { API_URL } from '../config';

const CategoryResults = () => {
    const [posts, setPosts] = React.useState([]);
    const { id } = useParams();

    React.useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axiosInstance.get(`/api/posts/category/${id}`);
                setPosts(response.data);
            } catch (error) {
                console.error('Error loading category posts:', error);
            }
        };
        fetchPosts();
    }, [id]);

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
                                category={category} />
                                )
                    }
            </div> : <h2 className='center'>No posts in this category yet!</h2>}
        </section>
    )
}


export default CategoryResults;

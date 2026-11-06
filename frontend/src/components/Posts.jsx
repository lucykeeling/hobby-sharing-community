import React, { useState } from 'react';
import PostItem from './PostItem';

const Posts  = () => {
    const [posts, setPosts] = useState(DUMMY_POSTS);
    return (
        <section className="container posts_container">
        {
            posts.map(({id, image, category, title, description, authorID}) => 
                <PostItem key={id} postID={id} image={image} category={category} title={title} description={description} authorID={authorID} />
            )
        }
        </section>
    )
}

export default Posts;

const DUMMY_POSTS = [
    {
        id: 1,
        title: 'Gardening Tips',
        description: 'Learn how to grow your own vegetables and flowers.',
        category: 'Gardening',
        image: 'https://example.com/gardening.jpg',
        authorID: 1,
        createdAt: '2023-06-01T10:00:00Z',
        updatedAt: '2023-06-01T10:00:00Z',
    },
    {
        id: 2,
        title: 'Crocheting Patterns',
        description: 'Discover beautiful crocheting patterns for your next project.',
        category: 'Crocheting',
        image: 'https://example.com/crocheting.jpg',
        authorID: 2,
        createdAt: '2023-06-02T14:30:00Z',
        updatedAt: '2023-06-02T14:30:00Z',
    },
    {
        id: 3,
        title: 'Exercise Routines',
        description: 'Get fit with these effective exercise routines.',
        category: 'Exercise',
        image: 'https://example.com/exercise.jpg',
        authorID: 3,
        createdAt: '2023-06-03T09:15:00Z',
        updatedAt: '2023-06-03T09:15:00Z',
    },
    {
        id: 4,
        title: 'Chess Strategies',
        description: 'Improve your chess game with these strategies.',
        category: 'Chess',
        image: 'https://example.com/chess.jpg',
        authorID: 4,
        createdAt: '2023-06-04T11:45:00Z',
        updatedAt: '2023-06-04T11:45:00Z',
    },
]



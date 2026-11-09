import React from 'react';
import PostItem from '../components/PostItem';
import axiosInstance from '../axiosConfig';
import { useSearchParams } from 'react-router-dom';
import { API_URL } from '../config';

const Search = () => {
    const [posts, setPosts] = React.useState([]);
    const [searchParams] = useSearchParams();
    const [query, setQuery] = React.useState(searchParams.get('q') || '');
    const [searchText, setSearchText] = React.useState(query);


    React.useEffect(() => {
        const q = searchParams.get('q') || '';
        setQuery(q);
        setSearchText(q);
    }, [searchParams]);


    React.useEffect(() => {
        if (!query) {         
            setPosts([]);
            return;
        }

        const fetchPosts = async () => {
            try {
                const response = await axiosInstance.get('/api/posts/search', { params: { q: query } });
                setPosts(response.data);
            } catch (error) {
                console.error('Error searching posts:', error);
            }
        };
        fetchPosts();
    }, [query]);

    const handleSearch = (e) => {
        e.preventDefault();
        setQuery(searchText.trim());
    };


    return (
                <section className="category_posts">
                    <form className="search_form" onSubmit={handleSearch}>
                        <input
                            type="text"
                            placeholder="Search by title or category..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                        <button type="submit" className="btn primary">Search</button>
                    </form>


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
            </div> : <h2 className='center'>
                {query ? 'No posts match your search.' : 'Enter a search term to find posts.'}</h2>}
        </section>
    )
}


export default Search;

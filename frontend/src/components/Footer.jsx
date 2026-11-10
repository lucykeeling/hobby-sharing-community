import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const Footer = () => {
    const [categories, setCategories] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axiosInstance.get('/api/categories');
                setCategories(response.data);
            } catch (err) {
                console.error('Could not load categories', err);
            }
        };
        fetchCategories();
    }, []);

    return (
        <footer>
            <ul className="footer_categories">
                {categories.map((cat) => (
                    <li key={cat._id}>
                        {user ? (
                            <Link to={`/category/${cat._id}`}>{cat.Category_name}</Link>
                        ) : (
                            <span>{cat.Category_name}</span>
                        )}
                    
                    </li>
                ))}
            </ul>
            <div className="footer_copyright">
                <small> All Rights Reserved &copy; Copyright, Lucy Keeling n810251.</small>
            </div>
        </footer>
    );
};

export default Footer;

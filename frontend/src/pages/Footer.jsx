import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer>
            <ul className = "footer_categories">
                <li><Link to="/posts/categories/Gardening">Gardening</Link></li>
                <li><Link to="/posts/categories/Crocheting">Crocheting</Link></li>
                <li><Link to="/posts/categories/Exercise">Exercise</Link></li>
                <li><Link to="/posts/categories/Chess">Chess</Link></li>
                <li><Link to="/posts/categories/Collecting">Collecting</Link></li>
            </ul>
            <div className="footer_copyright">
                <small> All Rights Reserved &copy; Copyright, Lucy Keeling n810251.</small>
            </div>
        </footer>
    );
}   

export default Footer;

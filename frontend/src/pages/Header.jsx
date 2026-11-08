import {FaBars} from 'react-icons/fa';
import {AiOutlineClose} from 'react-icons/ai';
import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import logo from '../images/logo.png';
import { useAuth } from '../context/AuthContext';


const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
      const handleLogout = () => {logout(); navigate('/login');};
    
      return (

        <nav>
            <div className="nav_container">
                <Link to="/" className="nav_logo">
                    <img src={logo} alt="Navbar Logo" />    
                    </Link>
                <ul className="nav_menu">
                    <li><Link to="/" className="nav-links">Home</Link> </li>
                    {user ? (
                        <>

                        <li><Link to="/createpost" className="nav-links">Create Post</Link> </li>
                        <li><Link to="/categories" className="nav-links">Browse by Category</Link> </li>
                        <li><Link to ="/dashboard" className="nav-links">Dashboard</Link> </li>
                        <li><button onClick={handleLogout} className="nav-links">Logout</button></li>
                        </>
                    ) : (
                        <>
                        <li><Link to="/login" className="nav-links">Login</Link> </li>
                        <li><Link to="/register" className="nav-links">Register</Link> </li>
                        </> 
                    )}
                    </ul>
                    
                    <button className= "nav_toggle-btn">
                        <AiOutlineClose />
                        </button>
                        </div>
        </nav>
    );
};

export default Header


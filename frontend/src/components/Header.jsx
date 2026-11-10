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
                <Link to="/posts" className="nav_logo">
                    <img src={logo} alt="Navbar Logo" />    
                    </Link>
                <ul className="nav_menu">
                    <li><Link to="/posts" className="nav-links">Home</Link> </li>
                    {user ? (
                        <>

                        <li><Link to="/createpost" className="nav-links">Create Post</Link> </li>
                        <li><Link to="/search" className="nav-links">Search Posts</Link> </li>
                        <li><Link to ="/dashboard" className="nav-links">Dashboard</Link> </li>

                        {user.role === 'Admin' && (
                            <>
                        <li><Link to="/moderate" className="nav-links">Moderate Posts</Link> </li>
                        <li><Link to="/settings" className="nav-links">Settings</Link> </li>
                        
                    </>)
                        }

                        <li><Link to="/profile" className="nav-links">Profile</Link> </li>
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


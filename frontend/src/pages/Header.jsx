import {FaBars} from 'react-icons/fa';
import {AiOutlineClose} from 'react-icons/ai';
import React from 'react';
import {Link} from 'react-router-dom';
import logo from '../images/logo.png';


const Header = () => {
    return (

        <nav>
            <div className="nav_container">
                <Link to="/" className="nav_logo">
                    <img src={logo} alt="Navbar Logo" />    
                    </Link>
                <ul className="nav_menu">
                    <li><Link to="/" className="nav-links">Home</Link> </li>
                    <li><Link to="/about" className="nav-links">Create Post</Link> </li>
                    <li><Link to="/services" className="nav-links">Authors</Link> </li>
                    <li><Link to="/contact" className="nav-links">Logout</Link> </li>
                    </ul>
                    <button className= "nav_toggle-btn">
                        <AiOutlineClose />
                        </button>
                        </div>
        </nav>
    )
}
export default Header;

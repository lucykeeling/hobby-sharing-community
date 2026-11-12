import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { useAuth } from '../context/AuthContext';



const ErrorPage = () => {
    const { user } = useAuth();
    return (
        <section className="error-page">
            <div className ="center">
                <h2>Oops! Page Not Found</h2>
                <Link to="/" className="btn primary"> {user ? "Back to Feed" : "Go to Login"} </Link>
                </div>
        </section>
    )
}
export default ErrorPage;
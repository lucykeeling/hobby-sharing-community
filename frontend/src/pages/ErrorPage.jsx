import { Link } from 'react-router-dom';

const ErrorPage = () => {
    return (
        <section className="error-page">
            <div className ="center">
                <Link to="/" className="btn primary">Back Home</Link>
                <h2>Oops! Page Not Found</h2>
            </div>
        </section>
    )
}
export default ErrorPage;
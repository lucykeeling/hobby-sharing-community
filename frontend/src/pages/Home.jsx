import home from '../images/home.png';

const Home  = () => {
    return (
        <section className="home">

        <h2> Welcome to the Hobby Sharing Community</h2>
        <div>
        <img src={home} alt="Hobby Sharing Community" className="home-image" />
        </div>
        </section>
    )
}

export default Home;

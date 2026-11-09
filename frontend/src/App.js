import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import CreatePost from './pages/CreatePost';
import Home from './pages/Home';
import Header from './pages/Header';
import Footer from './pages/Footer';
import PostDetail from './pages/PostDetail';
import Dashboard from './pages/Dashboard';
import CategoryPosts from './pages/CategoryPosts';
import EditPost from './pages/EditPost';
import Moderate from './pages/Moderate';
import CategoryResults from './pages/CategoryResults';
import Settings from './pages/Settings';



function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/createpost" element={<CreatePost />} />
        <Route path="/" element={<Home />} />
        <Route path="/post/:id" element={<PostDetail />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/post/:id/edit" element={<EditPost />} />
        <Route path="/search" element={<CategoryPosts />} />
        <Route path="/moderate" element={<Moderate />} />
        <Route path="/category/:id" element={<CategoryResults />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from './context/AuthContext';

/* **I SAW THIS IN TUTORIAL BUT NOT SURE I NEED IT?
import Layout from './components/Layout';
import ErrorPage from './components/ErrorPage';
import Home from './pages/Home';
import PostDetails from './pages/PostDetails';
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Authors from './pages/Authors';
import CreatePost from './pages/CreatePost';
import CategoryPosts from './pages/CategoryPosts';
import AuthorPosts from './pages/AuthorPosts';
import Dashboard from './pages/Dashboard';
import EditPost from './pages/EditPost';
import DeletePost from './pages/DeletePost';
import Logout from './pages/Logout';


const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {index: true, element: <Home />},
      {path: 'post/:id', element: <PostDetails />},
      {path: 'register', element: <Register />},
      {path: 'login', element: <Login />},
      {path: 'profile/:id', element: <Profile />},
      {path: 'authors', element: <Authors />},
      {path: 'create', element: <CreatePost />},
      {path: 'posts/categories/:category', element: <CategoryPosts />},
      {path: 'posts/authors/:name', element: <AuthorPosts />},
      {path: 'myposts/:id', element: <Dashboard />},
      {path: 'posts/:id/edit', element: <EditPost />},
      {path: 'posts/:id/delete', element: <DeletePost />},
      {path: 'logout', element: <Logout />},
    ],
  },
]);
*/

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);


import React from 'react';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const Settings = () => {
    const { user } = useAuth();
    const [categories, setCategories] = React.useState([]);
    const [name, setName] = React.useState('');
    const [editingId, setEditingId] = React.useState(null);
    const [showForm, setShowForm] = React.useState(false);
    const [error, setError] = React.useState('');

    const authConfig = { headers: { Authorization: `Bearer ${user?.token}` } };

    React.useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axiosInstance.get(`/api/categories`);
                setCategories(response.data);
            } catch (err) {
                setError('Could not load categories');
            }
        };
        fetchCategories();
    }, []);


        const startAdd = () => {
        setEditingId(null);  
        setName('');
        setError('');
        setShowForm(true);
    };

    const startEdit = (cat) => {
        setEditingId(cat._id);          
        setName(cat.Category_name);     
        setError('');
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingId(null);
        setName('');
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!name.trim()) {
            setError('Please enter a category name');
            return;
        }

        try {
            if (editingId) {
                const res = await axiosInstance.put(
                    `/api/categories/${editingId}`, { Category_name: name }, authConfig);
                setCategories(categories.map(c => c._id === editingId ? res.data : c));
            } else {
                const res = await axiosInstance.post(
                    '/api/categories', { Category_name: name }, authConfig);
                setCategories([...categories, res.data]);
            }
            closeForm();
        } catch (err) {
            setError(err.response?.data?.message || 'Could not save category');
        }
    };
 
    // Delete a category
            const handleDelete = async (categoryId) => {
        if (!window.confirm('Are you sure you want to delete this category?')) return;
        try {
            await axiosInstance.delete(`/api/categories/${categoryId}`, authConfig);
            setCategories(categories.filter(c => c._id !== categoryId));
        } catch (err) {
            setError(err.response?.data?.message || 'Unable to delete category');
        }
    };


     if (user?.role !== 'Admin') {
        return <h2 className="center">Admins only.</h2>;
    }

    return (
        <section className="dashboard">
            <div className="container dashboard_container">
                <div className="dashboard_post-actions">
                    <h2>Categories</h2>
                    <button onClick={startAdd} className="btn sm primary">+ Add new category</button>
                </div>

                {error && <p className="form_error-message">{error}</p>}

                {showForm && (
                    <form onSubmit={handleSubmit} className="form create-post_form">
                        <input type="text" placeholder="Category name" value={name}
                               onChange={(e) => setName(e.target.value)} autoFocus />
                        <button type="submit" className="btn primary">
                            {editingId ? 'Update' : 'Add'}
                        </button>
                        <button type="button" onClick={closeForm} className="btn">Cancel</button>
                    </form>
                )}

                {categories.length ? categories.map(cat => (
                    <article key={cat._id} className="dashboard_post">
                        <div className="dashboard_post-info"><h5>{cat.Category_name}</h5></div>
                        <div className="dashboard_post-actions">
                            <button onClick={() => startEdit(cat)} className="btn sm primary">Edit</button>
                            <button onClick={() => handleDelete(cat._id)} className="btn sm danger">Delete</button>
                        </div>
                    </article>
                )) : <h2 className="center">No categories yet.</h2>}
            </div>
        </section>
    );
};

export default Settings;


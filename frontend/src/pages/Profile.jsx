import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';
import Avatar from '../images/avatar.png';
import { API_URL } from '../config';


const Profile = () => {
  const { user } = useAuth(); // Access user token from context
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    postCount: '',
    profileImage: '',
  });
  const [image, setImage] = useState(null);   
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Fetch profile data from the backend
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get('/api/auth/profile', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setFormData({
          name: response.data.name,
          email: response.data.email,
          role: response.data.role,
          profileImage: response.data.profileImage,
        });
        setIsAdmin(response.data.role === 'Admin');
      } catch (error) {
        alert('Failed to fetch profile. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchProfile();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('email', formData.email);
      data.append('role', formData.role);
      if (image) {
        data.append('profileImage', image);
      }

      await axiosInstance.put('/api/auth/profile', data, {
        headers: { Authorization: `Bearer ${user.token}`, 'Content-Type': 'multipart/form-data' },
      });
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-20">
      <form onSubmit={handleSubmit} className="form bg-white p-6 rounded shadow-md">
        <h1 className="text-2xl font-bold text-center">Your Profile</h1>

          <img
    src={
      image
        ? URL.createObjectURL(image)
        : formData.profileImage
        ? `${API_URL}/uploads/${formData.profileImage}`
        : Avatar  
    }
    alt="Profile"
    className="profile-image mb-4"
  />
  
        <input 
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className = "profile-input mb-4"
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className = "profile-input mb-4"
        />
        <input 
        type="file" 
        onChange={(e) => setImage(e.target.files[0])} 
        accept="image/png, image/jpeg" />


        {isAdmin && (
          <fieldset>
            <legend className="mb-2 font-semibold">Role</legend>
            {[
            { value: 'Member', label: 'Member' },
            { value: 'Admin', label: 'Admin' },
             ].map(({ value, label }) => (
            <label key={value} className="mr-6 inline-flex items-center">
            <input
            type="radio"
            name="role"
            value={value}
            checked={formData.role === value}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="mr-2"
          />
          {label}
          </label>
          ))}
          </fieldset>
)}

        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
};

export default Profile;

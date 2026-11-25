import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';
import Avatar from '../images/avatar.png';
import { API_URL } from '../config';
import PostItem from '../components/PostItem';
import { Navigate, useParams } from 'react-router-dom';
import ProfileBio from '../components/Profile/ProfileBio';
import ProfileBadges from '../components/Profile/ProfileBadges';
import ProfilePostStats from '../components/Profile/ProfilePostStats';



const Profile = () => {
  const { user } = useAuth(); // Access user token from context
  const { userId } = useParams();
  const isOwnProfile = !userId || userId === user?.id;
  const profileId = isOwnProfile ? user?.id : userId;
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    postCount: '',
    hasProfileImage: false,
  });
  const [visibility, setVisibility] = useState({ bio: true, badges: true, postStats: true });
  const [savingVisibility, setSavingVisibility] = useState(false);
  const [image, setImage] = useState(null);
  const [avatarVersion, setAvatarVersion] = useState(Date.now());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [sections, setSections] = useState({});

  useEffect(() => {
    // Fetch profile data from the backend
    const fetchProfile = async () => {
      setLoading(true);
      setSaving(false);
      setError('');
      setMessage('');
      setNotFound(false);
      try {
        const url = isOwnProfile ? '/api/user/profile' : `/api/user/profile/${userId}`;
        const response = await axiosInstance.get(url, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setFormData({
          name: response.data.name,
          email: response.data.email,
          role: response.data.role,
          hasProfileImage: response.data.hasProfileImage,
        });
        setIsAdmin(response.data.role === 'Admin');
        setSections({ bio: response.data.bio, badges: response.data.badges, postStats: response.data.postStats });
        if (response.data.visibility) setVisibility(response.data.visibility);
      } catch (error) {
        if (error.response?.status === 404) {
          setNotFound(true);
        } else {
          setError(error.response?.data?.message || 'Failed to load profile. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchProfile();
  }, [user, userId]);

  const [posts, setPosts] = useState([]);

  const fetchUserPosts = async () => {
    try {
      const url = isOwnProfile ? '/api/posts/user' : `/api/posts/author/${userId}`;
      const response = await axiosInstance.get(url, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching user posts:', error);
    }
  };

  useEffect(() => {
    if (user) fetchUserPosts();
  }, [user, userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('email', formData.email);
      data.append('role', formData.role);
      if (image) {
        data.append('profileImage', image);
      }

      await axiosInstance.put('/api/user/profile', data, {
        headers: { Authorization: `Bearer ${user.token}`, 'Content-Type': 'multipart/form-data' },
      });
      if (image) {
        setFormData((prev) => ({ ...prev, hasProfileImage: true }));
        setImage(null);
        setAvatarVersion(Date.now());
      }
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      await fetchUserPosts();
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update profile. Please try again.' });
    } finally {
      setSaving(false);
      ;
    }
  };
  const handleToggle = async (key) => {
  const previous = visibility;
  const next = { ...visibility, [key]: !visibility[key] };

  setVisibility(next);         
  setSavingVisibility(true);
  setMessage(null);
  try {
    await axiosInstance.put('/api/user/profile',
      { visibility: JSON.stringify(next) },
      { headers: { Authorization: `Bearer ${user.token}` } });
  } catch (error) {
    setVisibility(previous);   
    setMessage({ type: 'error', text: error.response?.data?.message || 'Could not save visibility.' });
  } finally {
    setSavingVisibility(false);
  }
};

  const isVisible = (section) => isOwnProfile ? visibility[section] : sections[section] !== undefined;

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (user && userId === user.id) {
    return <Navigate to="/profile" replace />;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center mt-20">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="max-w-md mx-auto mt-20 p-4 bg-yellow-100 text-yellow-700 rounded shadow-md" role="alert">
        <p className="mb-3"> User not found. </p>
      </div>
    )
  }


  if (error) {
    return (
      <div className="max-w-md mx-auto mt-20 p-4 bg-red-100 text-red-700 rounded shadow-md" role="alert">
        <p className="mb-3"> {error} </p>
        <button onClick={() => window.location.reload()} className="bg-red-700 text-white px-4 py-2 rounded"> Try again
        </button>
      </div>
    )
  };


  return (
    <div className="max-w-6xl mx-auto mt-20 flex gap-8">
      {isOwnProfile ? (
        <form onSubmit={handleSubmit} className="form bg-white p-6 w-1/3 rounded shadow-md">
          <h1 className="text-2xl font-bold text-center">Your Profile</h1>

          <img
            src={
              image
                ? URL.createObjectURL(image)
                : formData.hasProfileImage
                  ? `${API_URL}/api/user/user-image/${profileId}?t=${avatarVersion}`
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
            className="profile-input mb-4"
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="profile-input mb-4"
          />
          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            accept="image/png, image/jpeg" />

          <fieldset className="mb-4">
            <legend className="mb-2 font-semibold">Show on public profile</legend>
            {['bio', 'badges', 'postStats'].map((key) => (
              <label key={key} className="mr-4 inline-flex items-center">
                <input
                  type="checkbox"
                  checked={visibility[key]}
                  disabled={savingVisibility}
                  onChange={() => handleToggle(key)}
                  className="mr-2"
                />
                {key}
              </label>
            ))}
          </fieldset>

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
          {message && (
            <p className={message.type === 'error' ? 'text-red-600 mb-3' : 'text-green-600 mb-3'}
              role="alert">
              {message.text}
            </p>
          )}

          <button type="submit" disabled={saving} className="w-full bg-blue-600 text-white p-2 rounded">
            {saving ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      ) : (
        <div className="bg-white p-6 w-1/3 rounded shadow-md text-center">
          <img
            src={
              formData.hasProfileImage
                ? `${API_URL}/api/user/user-image/${profileId}?t=${avatarVersion}`
                : Avatar
            }
            alt="Profile"
            className="profile-image mb-4"
          />
          <h1 className="text-2xl font-bold">{formData.name}</h1>
        </div>
      )}

      <section className="category_posts flex-1 mt-0">
        <div className="space-y-4">
          {isVisible('bio') && <ProfileBio bio= {sections.bio} isOwner={isOwnProfile} />}
          {isVisible('badges') && <ProfileBadges badges={sections.badges} isOwner={isOwnProfile} />}
          {isVisible('postStats') && <ProfilePostStats postsCount={sections.postStats?.postsCount} isOwner={isOwnProfile} />}
        </div>

        {posts.length > 0 ? <div className="container profile_post_container">
          {
            posts.map(({ _id, title, description, creator, createdAt, category }) =>
              <PostItem
                key={_id}
                postID={_id}
                title={title}
                description={description}
                image={`${API_URL}/api/posts/image/${_id}`}
                creator={creator}
                createdAt={createdAt}
                category={category}
                avatarVersion={avatarVersion} />
            )
          }
        </div> : <h2 className='center'>No posts available.</h2>}
      </section>

    </div>
  );
};

export default Profile;

import { useState, useEffect } from 'react';
import axiosInstance from '../../axiosConfig';


const ProfileBadges = ({ badges, isOwner, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selected, setSelected] = useState([]); 
  const [catalogue, setCatalogue] = useState( {options: [], maxBadges: 0} );
  const { options, maxBadges } = catalogue;
  const hasBadges = badges && badges.length > 0;
  const limitReached = selected.length >= maxBadges;

  useEffect(() => {
    if (!isOwner) return;
    axiosInstance.get('/api/user/badges')
      .then((response) => setCatalogue(response.data))
      .catch((error) => console.error('Could not load badges:', error.message));
  }, [isOwner]);


  const startEditing = () => {
    const savedNames = (badges || []).map((badge) => badge.name);
    
    setSelected(
      options.map((option) => option.name).filter((name) => savedNames.includes(name))
    );
    setIsEditing(true);
  };

  const toggleBadge = (name) => {
    if (selected.includes(name)) {
      setSelected(selected.filter((item) => item !== name));
    } else if (!limitReached) {
      setSelected([...selected, name]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(options.filter((option) => selected.includes(option.name)));
    setIsEditing(false);
  };

  return (
    <section className="bg-white p-4 rounded shadow-md mb-4">
      <h2 className="text-lg font-semibold mb-1">Badges</h2>

      {isOwner && isEditing ? (
        <form onSubmit={handleSubmit}>
          <p className="mb-2" aria-live="polite">
            {selected.length} of {maxBadges} selected
          </p>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {options.map(({ name, description }) => {
              const checked = selected.includes(name);
              return (
                <label key={name} className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    checked={checked}
                    disabled={!checked && limitReached}
                    onChange={() => toggleBadge(name)}
                  />
                  <span>
                    <span className="block font-semibold">{name}</span>
                    <span className="block text-sm text-gray-500">{description}</span>
                  </span>
                </label>
              );
            })}
          </div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded mr-2">
            Save
          </button>
          <button type="button" onClick={() => setIsEditing(false)} className="border px-4 py-2 rounded">
            Cancel
          </button>
        </form>
      ) : (
        <>
          {hasBadges ? (
            <ul className="flex flex-wrap gap-2 mb-2">
              {badges.map((badge) => (
                <li key={badge.name} title={badge.description} className="rounded-full bg-blue-100 text-blue-800 px-3 py-1 text-sm font-semibold">
                  {badge.name}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">
              {isOwner ? "You haven't selected any badges yet." : 'No badges yet.'}
            </p>
          )}
          {isOwner && (
            <button type="button" onClick={startEditing} disabled={options.length === 0} className="text-blue-600 mt-2">
              Edit badges
            </button>
          )}
        </>
      )}
    </section>
  );
};

export default ProfileBadges;
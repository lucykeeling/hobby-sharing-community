import { useState } from 'react';

const MAX_BADGES = 5;

const BADGE_OPTIONS = [
  { name: 'Beginner', description: 'Just getting started' },
  { name: 'Enthusiast', description: 'Loves spending time on hobbies' },
  { name: 'Mentor', description: 'Happy to help others learn' },
  { name: 'Collaborator', description: 'Keen to work on shared projects' },
  { name: 'Crafter', description: 'Makes things by hand' },
  { name: 'Artist', description: 'Draws, paints or designs' },
  { name: 'Gardener', description: 'Grows plants and food' },
  { name: 'Home Cook', description: 'Enjoys cooking and baking' },
  { name: 'Photographer', description: 'Captures moments on camera' },
  { name: 'Musician', description: 'Plays or creates music' },
  { name: 'Bookworm', description: 'Always has a book on the go' },
  { name: 'Gamer', description: 'Enjoys video or tabletop games' },
  { name: 'Outdoor Explorer', description: 'Hikes, camps and explores' },
  { name: 'Fitness Fan', description: 'Stays active through sport or exercise' },
  { name: 'DIY Builder', description: 'Builds and repairs things' },
];

const ProfileBadges = ({ badges, isOwner, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selected, setSelected] = useState([]); 
  const hasBadges = badges && badges.length > 0;
  const limitReached = selected.length >= MAX_BADGES;

  const startEditing = () => {
    const savedNames = (badges || []).map((badge) => badge.name);
    
    setSelected(
      BADGE_OPTIONS.map((option) => option.name).filter((name) => savedNames.includes(name))
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
    onSave(BADGE_OPTIONS.filter((option) => selected.includes(option.name)));
    setIsEditing(false);
  };

  return (
    <section className="bg-white p-4 rounded shadow-md mb-4">
      <h2 className="text-lg font-semibold mb-1">Badges</h2>

      {isOwner && isEditing ? (
        <form onSubmit={handleSubmit}>
          <p className="mb-2" aria-live="polite">
            {selected.length} of {MAX_BADGES} selected
          </p>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {BADGE_OPTIONS.map(({ name, description }) => {
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
            <ul className="badge-list">
              {badges.map((badge) => (
                <li key={badge.name} className="badge-item">
                  <span className="badge-name">{badge.name}</span>
                  <span className="badge-description">{badge.description}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">
              {isOwner ? "You haven't selected any badges yet." : 'No badges yet.'}
            </p>
          )}
          {isOwner && (
            <button type="button" onClick={startEditing} className="text-blue-600 mt-2">
              Edit badges
            </button>
          )}
        </>
      )}
    </section>
  );
};

export default ProfileBadges;
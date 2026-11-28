import { useState } from 'react';

export const MAX_BIO_LENGTH = 300;

export const validateBio = (bio = '') => {
  const { length } = bio.trim();
  if (length > MAX_BIO_LENGTH) {
    return `Bio must be ${MAX_BIO_LENGTH} characters or less (currently ${length}).`;
  }
  return '';
};

const ProfileBio = ({ bio, isOwner, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);
  const hasBio = Boolean(bio?.trim());
  const length = draft.trim().length;
  const error = validateBio(draft);


  const startEditing = () => {
    setDraft(bio || '');
    setIsEditing(true);
    setStatus(null);
  };

  const cancelEditing = () => {
    setStatus(null);
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (error) return;
    setSaving(true);
    setStatus(null);

    try {
      await onSave(draft.trim());
      setStatus({ type: 'success', text: 'Bio saved successfully.' });
      setIsEditing(false);
    } catch (err) {
      setStatus({ type: 'error', text: err.response?.data?.message || 'Could not save your bio. Please try again.' });
    } finally {
      setSaving(false);
    }   
  };

  return (
    <section className="bg-white p-4 rounded shadow-md mt-0 mb-2">
      <h2 className="text-lg font-semibold mb-2">Bio</h2>

      {isOwner && isEditing ? (
        <form onSubmit={handleSubmit}>
          <textarea
            aria-label="Bio"
            aria-invalid={Boolean(error)}
            rows="4"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Write a short bio about yourself..."
            className={`w-full mb-1 p-2 border rounded ${error ? 'border-red-500' : 'border-gray-300'}`}
          />
          <p className={`text-sm ${error ? 'text-red-500' : 'text-gray-500'}`}>
            {length}/{MAX_BIO_LENGTH} characters
          </p>
          {error && <p className="text-red-600 mb-2" role="alert">{error}</p>}

          <button type="submit" disabled={saving || Boolean(error)} className="bg-blue-600 text-white px-4 py-2 rounded mr-2 disabled:opacity-50">
            {saving ? 'Saving...' : 'Save'}
          </button>
          <button type="button" onClick={cancelEditing} disabled={saving} className="border px-4 py-2 rounded">
            Cancel
          </button>
        </form>
      ) : (
        <>
          {hasBio ? (
            <p className="whitespace-pre-wrap break-words">{bio}</p>
          ) : (
            <p className="text-gray-500 italic">
              {isOwner ? "You haven't added a bio yet." : 'No bio yet.'}
            </p>
          )}
          {isOwner && (
            <button type="button" onClick={startEditing} className="text-blue-600 mt-2">
              Edit bio
            </button>
          )}
        </>
      )}
      {status && (
        <p className={`mt-2 ${status.type === 'error' ? 'text-red-600' : 'text-green-600'}`} role="alert">
          {status.text}
        </p>
      )}
    </section>
  );
};

export default ProfileBio;
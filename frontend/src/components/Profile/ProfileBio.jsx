import { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const ProfileBio = ({ bio, isOwner, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const hasBio = Boolean(bio?.trim());

      const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
            ['link', 'image'],
            ['clean']
        ],
    };

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image'
    ];

  const startEditing = () => {
    setDraft(bio || '');
    setIsEditing(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(draft);
    setIsEditing(false);
  };

  return (
    <section className="bg-white p-4 rounded shadow-md mb-2">
      <h2 className="text-lg font-semibold mb-2">Bio</h2>

      {isOwner && isEditing ? (
        <form onSubmit={handleSubmit}>
        <ReactQuill 
        modules={modules} 
        formats={formats} 
        value={draft} 
        onChange={setDraft} 
        placeholder="Write your bio here..." 
        className="q1-editor" />

          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded mr-2">
            Save
          </button>
          <button type="button" onClick={() => setIsEditing(false)} className="border px-4 py-2 rounded">
            Cancel
          </button>
        </form>
      ) : (
        <>
          {hasBio ? (
            <p>{bio}</p>
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
    </section>
  );
};

export default ProfileBio;
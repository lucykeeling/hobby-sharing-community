const ProfileBio = ({ bio, isOwner }) => {
  const hasBio = Boolean(bio?.trim());

  return (
    <section className="bg-white p-4 rounded shadow-md mb-2">
      <h2 className="text-lg font-semibold mb-2">Bio</h2>
      {hasBio ? (
        <p>{bio}</p>
      ) : (
        <p className="text-gray-500 italic">
          {isOwner ? "You haven't added a bio yet." : 'No bio yet.'}
        </p>
      )}
    </section>
  );
};

export default ProfileBio;
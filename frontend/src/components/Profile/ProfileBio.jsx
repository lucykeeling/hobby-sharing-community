const ProfileBio = ({ bio }) => {
    if (!bio) return null;
    return (
        <div className="bg-white p-4 rounded shadow-md mb-2">
            <h2 className="text-lg font-semibold mb-2">Bio</h2>
            <p>{bio || "No bio available."}</p>
        </div>
    );
}

export default ProfileBio;
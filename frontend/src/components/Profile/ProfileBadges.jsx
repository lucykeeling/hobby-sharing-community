const ProfileBadges = ({ badges }) => {
    if (!badges || badges.length === 0) return null;
    return (
        <section className="bg-white p-4 rounded shadow-md mb-4">
            <h2 className="text-lg font-semibold mb-1">Badges</h2>
            {badges && badges.length > 0 ? (
                <ul className="badge-list">
                    {badges.map((badge, index) => (
                        <li key={index} className="badge-item">
                            <span className="badge-name">{badge.name}</span>
                            <span className="badge-description">{badge.description}</span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No badges available.</p>
            )}
        </section>
    );
};

export default ProfileBadges;
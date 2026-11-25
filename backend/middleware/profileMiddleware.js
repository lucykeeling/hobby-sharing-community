const profileOwnerOnly = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Not authorized' });
    }
    if (req.params.id && req.params.id !== req.user.id) {
        return res.status(403).json({ message: 'You can only edit your own profile' });
    }
    next();
};

module.exports = { profileOwnerOnly };
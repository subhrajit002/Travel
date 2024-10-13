const adminAuthorization = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();  // Allow access to the admin
    } else {
        return res.status(403).json({ message: "Access denied. Admins only." });
    }
};

export default adminAuthorization;
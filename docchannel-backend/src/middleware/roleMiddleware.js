exports.isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ message: "Forbidden: Admin access only" });
    }
    next();
};



exports.isUser = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized: No user data" });
    }

    if (req.user.role !== "user") {
        return res.status(403).json({ message: "Access denied" });
    }

    next();
};

const authMiddleware = require("./authMiddleware");

module.exports = (req, res, next) => {
    authMiddleware(req, res, () => {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }
        next();
    });
};

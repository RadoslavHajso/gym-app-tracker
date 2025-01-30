const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", ""); // Odstráni "Bearer " z tokenu

    if (!token) {
        return res.status(401).json({ error: "Access denied, no token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;  // Priradí informácie o užívateľovi do req.user
        next();  // Pokračuje v ďalšom spracovaní požiadavky
    } catch (err) {
        res.status(400).json({ error: "Token is not valid" });
    }
};

module.exports = auth;
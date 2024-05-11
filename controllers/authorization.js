require("dotenv").config();
const jwt = require("jsonwebtoken");

const requireAuth = (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json("Unauthorized");
    } else {
        try {
            jwt.verify(authorization.split(" ")[1], process.env.JWT_ACCESS_TOKEN);
            return next();
        } catch (err) {
            return res.status(401).json("Unauthorized");
        }
    }
};

module.exports = { requireAuth: requireAuth };

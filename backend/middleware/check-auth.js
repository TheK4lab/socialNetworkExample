const jwt = require('jsonwebtoken');
const { jwtSecretKey } = require('../config');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, jwtSecretKey);
        req.userData = {
            email: decodedToken.email,
            userId: decodedToken.userId
        }
        next();
    } catch (error) {
        res.status(401).json({
            message: "Auth failed!: " + error
        });
    }

};
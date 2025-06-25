const userModel = require('../models/user.model');
const captainModel = require('../models/captain.model')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const blacklistTokenModel = require('../models/blacklistToken.model');

module.exports.authUser = async (req, res, next) => {
    const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized access.' });
    }
    const isBlacklisted = await blacklistTokenModel.findOne({ token });
    if (isBlacklisted) {
        return res.status(401).json({ message: 'Unauthorized access.' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded);
        console.log(user);
        req.user = user;
        next();
    } catch (err) {
        console.log(err);
        return res.status(401).json({ message: 'Unauthorized access.' });
    }
}

module.exports.authCaptain = async (req, res, next) => {
    const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized access' });
    }
    const isBlacklisted = await blacklistTokenModel.findOne({ token });
    if (isBlacklisted) {
        return res.status(401).json({ message: 'Unauthorized access.' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded._id)
        const captain = await captainModel.findById(decoded._id);
        console.log(captain);
        req.captain = captain;
        next();
    } catch (err) {
        console.error(err);
        return res.status(401).json({ message: 'Unauthorized access..' });
    }
}
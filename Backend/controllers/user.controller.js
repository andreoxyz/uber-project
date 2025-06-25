const userModel = require('../models/user.model');
const userService = require('../services/user.service');
const { validationResult } = require('express-validator');
const blacklistTokenaModel = require('../models/blacklistToken.model');

module.exports.registerUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { fullname, email, password } = req.body;
    const isUserAlreadyExists = await userModel.findOne({ email: email });
    if (isUserAlreadyExists) {
        return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await userModel.hashPassword(password);
    const user = await userService.createUser({
        firstname: fullname.firstname,
        lastname:fullname.lastname,
        email,
        password: hashedPassword
    });
    const token = user.generateAuthToken();
    res.status(201).json({
        message: 'User registered successfully',
        user,
        token
    });
} 

module.exports.loginUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    const user = await userModel.findOne({ email }).select('+password');
    if(!user){
        return res.status(401).json({ message: 'Invalid email or password' });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }
    const token = user.generateAuthToken();
    res.status(200).json({
        message: 'User logged in successfully',
        user,
        token
    });
}

module.exports.getUserProfile = async (req, res) => {
     res.status(200).json({
        message: 'User profile fetched successfully',
        user: req.user
    });
}

module.exports.logoutUser = async (req, res) => {
    res.clearCookie('token');
    const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];
    await blacklistTokenaModel.create({ token });
    res.status(200).json({
        message: 'User logged out successfully'
    });
}
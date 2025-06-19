const ecpress = require('express');
const router = ecpress.Router();
const {body} = require('express-validator');
const userController = require('../controllers/user.controller');


router.post('/register', [
    body('fullname.firstname').isLength({ min: 2 }).withMessage('First name must be at least 2 characters long'),
    body('email').isEmail().withMessage('Please enter a valid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], userController.registerUser);


module.exports = router
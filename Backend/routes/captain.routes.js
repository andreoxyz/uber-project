const express = require('express');
const router = express.Router();
const {body} = require('express-validator');
const captainController = require('../controllers/captain.controller');

router.post('/register', [
    body('fullname.firstname').isLength({ min: 2 }).withMessage('First name must be at least 2 characters long'),
    body('email').isEmail().withMessage('Please enter a valid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('vehicle.color').isLength({ min: 2 }).withMessage('Vehicle color is required'),
    body('vehicle.plate').isLength({ min: 3 }).withMessage('Vehicle plate is required'),
    body('vehicle.capacity').isInt({ min: 1 }).withMessage('Vehicle capacity must be at least 1'),
    body('vehicle.vehicleType').isIn(['car', 'bike', 'auto']).withMessage('Vehicle type must be one of: car, bike, auto')
], captainController.registerCaptain);


module.exports = router;
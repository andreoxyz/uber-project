const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const captainSchema = new mongoose.Schema({
    fullname:{
        firstname: {
            type: String,
            required: true,
            minlength:[2, 'First name must be at least 2 characters long'],
        },
        lastname: {
            type: String,
            minlength:[2, 'Last name must be at least 2 characters long'],
        }
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
    password:{
        type: String,
        required: true,
        minlength: [6, 'Password must be at least 6 characters long']
    },
    socketId:{
        type: String,
        default: null 
    },
    status:{
        type: String,
        enum: ['active', 'inactive', 'banned'], 
        default: 'inactive',
    },
    vehicle:{
        color: {
            type: String,
            required: true,
        },
        plate: {
            type: String,
            required: true,
            unique: true,
            min: [3, 'Please enter a valid vehicle plate number']
        },
        capacity:{
            type: Number,
            required: true,
            min: [1, 'Capacity must be at least 1'],
        },
        vehicleType: {
            type: String,
            required: true,
            enum: ['car', 'bike', 'auto'], // Example vehicle types
        }
    },
    location: {
        lat:{
           type: Number,
        },
        lng:{
           type: Number,
        }
    }
})

captainSchema.methods.generateAuthToken = async function() {
    const token = jwt.sign({_id: this._id}, process.env.JWT_SECRET, { expiresIn: '24h' });
    return token;
}
captainSchema.methods.comparePassword = async function(Password) {
    const isMatch = await bcrypt.compare(Password, this.password);
    return isMatch;
}
captainSchema.statics.hashPassword = async function(password) {
    return await bcrypt.hash(password, 10);
}

const CaptainModel = mongoose.model('Captain', captainSchema);

module.exports = CaptainModel;
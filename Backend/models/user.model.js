const { Socket } = require('dgram');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const userSchema = new mongoose.Schema({
    fullname: {
        firstname: {
            type: String,
            required: true,
            minlength:[2, 'First name must be at least 2 characters long'],
        },
        lastname: {
            type: String,
            required: true,
            minlength:[2, 'Last name must be at least 2 characters long'],
        },
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: [5, 'Please enter a valid email address'],
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    Socketid: {
        type: String,
        default: null
    },
})

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET,{expiresIn: '24h'});
    return token;
}

userSchema.methods.comparePassword = async function (candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
}

userSchema.statics.hashPassword = async function (password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
}

const userModel= mongoose.model('User', userSchema);

module.exports = userModel;
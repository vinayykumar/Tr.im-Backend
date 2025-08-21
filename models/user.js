const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Schema Creation
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    resetPasswordToken : {
        type : String
    },
    resetPasswordExpires : {
        type : Date
    },
    isVerified: { type: Boolean, default: false },
    otp: {type : String},
    otpExpiry: {type : Date},
    refreshTokens: [{ type: String }]
}, { timestamps: true });

// Hash password before saving
// userSchema.pre('save', async function(next) {
//     if (!this.isModified('password')) return next();
//     try {
//         const salt = await bcrypt.genSalt(10);
//         this.password = await bcrypt.hash(this.password, salt);
//         next();
//     } catch (err) {
//         next(err);
//     }
// });

// Compare passwords during login
// userSchema.methods.comparePassword = async function(candidatePassword) {
//     return await bcrypt.compare(candidatePassword, this.password);
// };

// Model Creation
const User = mongoose.model('User', userSchema);

module.exports = User;

const mongoose = require('mongoose');
const validate = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 30,
    },
    lastName: {
        type: String,
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if (!validate.isEmail(value)) {
                throw new Error("Invalid email address");
            }
        }
    },
    password: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        min: 18,
    },
    gender: {
        type: String,
        enum: {
            values: ['Male', 'Female', 'Other'],
            message: '{VALUE} is not a valid gender'
        },
        validate(value) {
            if (!['Male', 'Female', 'Other'].includes(value)) {
                throw new Error("Gender must be Male, Female, or Other");
            }
        }
    },
    photoUrl: {
        type: String,
        default: "https://media.istockphoto.com/id/1553217327/vector/user-profile-icon-avatar-person-sign-profile-picture-portrait-symbol-easily-editable-line.jpg?s=170667a&w=0&k=20&c=xUuHLFaa94WIFdV-XBgxX9SSsaJJgGQhE1Tmevqrytg=",
        validate(value) {
            if (!validate.isURL(value)) {
                throw new Error("Invalid URL for photo");
            }
        }
    },
    about: {
        type: String,
        default: "This is a default details of users",
    },
    skills: {
        type: [String],
    },
}, { timestamps: true });

// Index for faster search by first and last name - compound index 
// Ex: firstName: "John", lastName: "Doe"
userSchema.index({ firstName: 1, lastName: 1 });

// Method to generate JWT
userSchema.methods.getJWT = function () {
    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
        { userId: this._id },
        "SecretKey@12D3",
        { expiresIn: "5d" }
    );
    return token;
}

// Method to compare password
userSchema.methods.comparePassword = async function (plainPassword) {
    const user = this;
    return await bcrypt.compare(plainPassword, user.password);
}

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
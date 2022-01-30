require('dotenv').config({
    path: "../../config/dev.env"
});
const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bycrypt = require('bcrypt');
const UserPersonalDetails = require('./Schema.UserPersonal');


const UsersSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        validate(value) {
            if (!(validator.isEmail(value))) {
                throw new Error('Please enter valid email')
            }
        }
    },
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        validate(value) {
            if (value.length > 32) {
                throw new Error('Max limit reached.')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot be password')
            }
        }

    },
    userType: {
        type: String,
        enum: ['PERSONAL', 'BUSINESS'],
        default: 'PERSONAL'
    },
    userImage: {
        type: Buffer
    },
    accessToken: [{
        token: {
            type: String,
            required: true,
        }
    }]

}, {
    timestamps: true
})


UsersSchema.virtual('personalDetails', {
    ref: 'UserPersonalDetails',
    localField: '_id',
    foreignField: 'user'
})

UsersSchema.methods.generateAccessToken = async function () {
    const user = this;
    const token = jwt.sign({
        id: user._id.toString(),
        email: user.email
    }, process.env.SECRET_JWT_KEY);
    user.accessToken = user.accessToken.concat({
        token
    });
    await user.save();
    return token;
}

UsersSchema.methods.removeUnnecessary = async function () {
    const user = this;
    const userData = user.toObject();
    delete userData._id;
    delete userData.createdAt;
    delete userData.updatedAt;
    delete userData.password;
    delete userData.accessToken;
    delete userData.userType;
    delete userData.userImage;
    delete userData.__v;
    return userData;
}

UsersSchema.statics.checkCredentials = async function (email, password) {
    const user = await Users.findOne({
        email: email
    });
    if (!user) {
        throw new Error(`Email ${email} is not found.`);
    }
    const isPasswordMatch = await bycrypt.compare(password, user.password);
    if (!isPasswordMatch) {
        throw new Error(`Invalid password, Please check the password`)
    }
    return user;
}

UsersSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bycrypt.hash(user.password, 8)
    }

    next();
})
const Users = mongoose.model('Users', UsersSchema);

module.exports = Users;
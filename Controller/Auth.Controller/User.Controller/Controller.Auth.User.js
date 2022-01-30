const Users = require('../../../Model/User.Model/Schema.User');
const UserPersonalDetails = require('../../../Model/User.Model/Schema.UserPersonal')
const {
    UserCreate,
    UserLoginDto,
    UserEditDto,
} = require('../../../Dtos/Auth/Users.Dtos/Users.Dtos');
const {
    VerifyOTP
} = require('../../../Dtos/Auth/ValidationDtos');
const lodash = require('lodash');
const validator = require('validator');
const {
    sendOTP
} = require('../../../Services/OTPVerification/OTPVerification');


const AuthUsersController = {
    registerUser: async (req, res) => {
        try {
            const err = UserCreate.validate(req.body);
            if (!(lodash.isEmpty(err))) {
                return res.status(400).json({
                    success: false,
                    error: err[0].message
                })
            }
            const newUser = new Users(req.body);
            await newUser.save();
            const token = await newUser.generateAccessToken();
            const userNewData = await newUser.removeUnnecessary();
            res.status(201).json({
                success: true,
                user: userNewData,
                accessToken: token
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.toString()
            })
        }
    },
    userLogin: async (req, res) => {
        try {
            const err = UserLoginDto.validate(req.body);
            if (!(lodash.isEmpty(err))) {
                return res.status(400).json({
                    success: false,
                    error: err[0].message
                });
            }
            const {
                email,
                password
            } = req.body;
            const isUserExist = await Users.checkCredentials(email, password);
            const userData = await isUserExist.removeUnnecessary();
            const accessToken = await isUserExist.generateAccessToken();
            res.status(200).json({
                success: true,
                user: userData,
                accessToken
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.toString()
            });
        }
    },
    userLogout: async (req, res) => {
        try {
            req.user.accessToken = req.user.accessToken.filter(token => {
                return token.token != req.token;
            })
            await req.user.save();
            res.status(200).json({
                success: true,
                message: `You have successfully logged out from the account.`
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.toString()
            });
        }
    },
    editUser: async (req, res) => {
        try {
            const err = UserEditDto.validate(req.body);
            if (!(lodash.isEmpty(err))) {
                return res.status(400).json({
                    success: false,
                    error: err[0].message
                });
            }
            console.log(req.body, "request bodyyyyyyyyyyyy");
            const providedItems = Object.keys(req.body);
            let isPersonalDetailsExistUser = await UserPersonalDetails.findOne({
                user: req.user._id
            });
            if (lodash.isEmpty(isPersonalDetailsExistUser)) {
                isPersonalDetailsExistUser = await UserPersonalDetails({
                    user: req.user._id
                });
            }
            providedItems.forEach(async (update) => {
                switch (update) {
                    case 'email':
                        req.user[update] = req.body[update];
                        req.user.accessToken = req.user.accessToken.filter(token => {
                            return token.token != req.token;
                        })
                        await req.user.save();
                        break;
                    case 'name':
                        req.user[update] = req.body[update];
                        await req.user.save();
                        break;
                    case 'address':
                        await isPersonalDetailsExistUser.isValueExist(req.body[update], 'addressType', update);
                        break;
                    case "phonenumber":
                        req.body[update].verificationCode = await sendOTP(req.body[update].phonenumber);
                        await isPersonalDetailsExistUser.isValueExist(req.body[update], 'numberType', update);
                        break;
                }
            })
            await req.user.save();
            await isPersonalDetailsExistUser.save();
            res.status(200).json({
                success: true,
                message: `User ${providedItems.map(key => {
                return `${key}`
           })} has successfully updated`
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.toString()
            });
        }
    },
    verifyPhoneNumber: async (req, res) => {
        try {
            const err = VerifyOTP.validate(req.body);
            if (!(lodash.isEmpty(err))) {
                return res.status(400).json({
                    success: false,
                    error: err[0].message
                });
            }
            console.log(req.body, "REQUEST BODY");
            const userPersonalDetails = await UserPersonalDetails.findOne({
                user: req.user._id
            });
            userPersonalDetails.phonenumber.map(numberObj => {
                if (numberObj.phonenumber === req.body.phonenumber && numberObj.verificationCode === req.body.otp) {
                    numberObj.isVerified = true;
                }
            });
            await userPersonalDetails.save();
            res.status(200).json({
                success: true,
                message: `${req.body.phonenumber} is verified.`
            });
        } catch (error) {
            console.log(error)
            res.status(500).json({
                success: false,
                error: error
            })
        }
    },


}

module.exports = AuthUsersController;
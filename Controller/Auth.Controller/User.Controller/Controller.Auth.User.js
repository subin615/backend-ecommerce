const Users = require('../../../Model/User.Model/Schema.User');
const {
    UserCreate,
    UserLoginDto
} = require('../../../Dtos/Auth/Users.Dtos/Users.Dtos');
const lodash = require('lodash');
const validator = require('validator');


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
                accessToken : token
            });
        } catch (error) {
            console.log(error);
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
            const {email, password} = req.body;
            const isUserExist = await Users.checkCredentials(email, password);
            const userData = await isUserExist.removeUnnecessary();
            const accessToken = await isUserExist.generateAccessToken();
            res.status(200).json({ success : true, user : userData, accessToken });
        
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.toString()
            });
        }
    },
    userLogout : async (req, res) => {
         try{
             req.user.accessToken = req.user.accessToken.filter(token => {
                 return token.token != req.token;
             })
             await req.user.save();
             res.status(200).json({ success: true, message : `You have successfully logged out from the account.` });
         }catch(error) {
             res.status(500).json({ success: false, error : error.toString()});
         }
    }
}

module.exports = AuthUsersController;
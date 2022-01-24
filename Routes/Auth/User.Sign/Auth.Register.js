require('dotenv').config({ path: "../../../config/dev.env" });
const Router = require('express').Router();
const Connection = require('../../../Database.Connection/index');
const AuthUsersController = require('../../../Controller/Auth.Controller/User.Controller/Controller.Auth.User');
const AuthGuard = require('../../../Middleware/middleware.Users')
Connection(process.env.USER_DB);



/** Register Users */

Router.post('/api/register', AuthUsersController.registerUser);

/**
 * Login User
 */

Router.post('/api/login', AuthUsersController.userLogin);

/**
 * Logout User
 */

Router.post('/api/logout', AuthGuard, AuthUsersController.userLogout);








module.exports = Router;


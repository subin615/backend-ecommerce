require('dotenv').config({ path : "../dev.env" });
const jwt = require('jsonwebtoken');
const Users = require('../Model/User.Model/Schema.User');

const Authentication = async (req, res, next) => {
     try{
       const accessToken = req.header('Authorization').replace("Bearer ", "");
       const decoded = jwt.verify(accessToken, process.env.SECRET_JWT_KEY);
       const isUserValid = await Users.findOne({ _id : decoded.id, email : decoded.email });
       if(!isUserValid) {
           throw new Error();
       }
       req.token = accessToken,
       req.user = isUserValid;
       next();
     }catch(error) {
         res.status(401).send({ success: false, error : `You are not authorized to access.`});
     }
}


module.exports = Authentication;
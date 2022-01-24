const { Schema } = require('valivar');

const UserCreate = new Schema({
    email : {
        type : String,
        required : true,
        match : /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    },
    name : {
        type : String,
        required : true,
        length : {min : 5, max : 32}
    },
    password : {
        type : String,
        required: true,
        length : {min: 5, max : 20}
    },
    userType : {
        type : String,
        required : true,
    }
})


const UserLoginDto = new Schema({
    email : {
        type : String,
        required: true,
        match : /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    },
    password : {
        type : String, 
        required : true
    }
})

module.exports = {
    UserCreate,
    UserLoginDto
}
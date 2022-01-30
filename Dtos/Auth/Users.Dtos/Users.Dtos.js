const {
    Schema
} = require('valivar');

const UserCreate = new Schema({
    email: {
        type: String,
        required: true,
        match: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        message: {
            type: 'Email must be valid.',
            required: 'Please provide a valid email.'
        }
    },
    name: {
        type: String,
        required: true,
        length: {
            min: 5,
            max: 32
        }
    },
    password: {
        type: String,
        required: true,
        length: {
            min: 5,
            max: 20
        },
    },
    userType: {
        type: String,
        enum: ["personal", "business"]
    }
})


const UserLoginDto = new Schema({
    email: {
        type: String,
        required: true,
        match: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        message: "Email must be valid."
    },
    password: {
        type: String,
        required: true,
        length: {
            min: 5
        },
        message: "Password must be 5 characters."
    }
})

const UserEditDto = new Schema({
    email: {
        type: String,
        match: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        message: 'Email must be valid.'

    },
    phonenumber: {
        phonenumber: {
            type: String,
            match: /^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/,
            message: 'Phone Number must be valid.'
        },
        numberType: {
            type: String,
            enum: ["HOME", "WORK"]
        }

    },
    name: {
        type: String,
        length: {
            min: 3,
            max: 32
        },
        message: 'Name must be valid.'
    },
    address: {
        country: {
            type: String,
            enum: ["IN"]
        },
        state: {
            type: String,
        },
        area: {
            type: String,
            length: {
                max: 50
            },
        },
        pinCode: {
            type: String,
            length: {
                min: 6,
                max: 6
            },
            message: "provide valid pincode."
        },
        addressType: {
            type: String,
            enum: ["HOME", "OFFICE", "BUSINESS"]
        }
    },
});



module.exports = {
    UserCreate,
    UserLoginDto,
    UserEditDto
}
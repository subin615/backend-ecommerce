const {
    Schema
} = require('valivar');

const VerifyOTP = new Schema({
    otp: {
        type: String,
        required: true,
        length: {
            max: 4,
            min: 4
        },
        message: "Provide a valid OTP"
    },
    phonenumber: {
        type: String,
        required: true,
        match: /^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/,
        message: "Provide a valid phone number."
    }
});


module.exports = {
    VerifyOTP
}
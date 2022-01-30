const unirest = require('unirest');
require('dotenv').config({
    path: "../../dev.env"
});

const sendOTP = async (number) => {
    let verificationCode = Math.floor(1000 + Math.random() * 9000);
    let req = unirest('POST', process.env.OTP_URL);
    req.headers({
        "authorization": process.env.SECRET_OTP_KEY
    });
    req.form({
        "variables_values": verificationCode,
        "route": "otp",
        "numbers": number,
    });
    req.end(function (res) {
        if (res.error && !res.return) throw new Error(res.error);
    });
    return verificationCode;
}


module.exports = {
    sendOTP
}
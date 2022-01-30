require('dotenv').config({
    path: "../../dev.env"
});
const mongoose = require('mongoose');
const {
    sendOTP
} = require('../../Services/OTPVerification/OTPVerification')

const UserPersonalSchema = new mongoose.Schema({
    phonenumber: [{
        phonenumber: {
            type: String,
            default: "",
            trim : true
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        numberType: {
            type: String,
            default: "HOME",
            enum: ["HOME", "WORK"]
        },
        verificationCode: {
            type: String,
            default: ""
        }
    }],
    GSTnumber: {
        type: String,
        default: "",
        maxLength: 15
    },
    address: [{
        country: {
            type: String,
            default: "IN",
            enum: ["IN"]
        },
        state: {
            type: String,
            trim : true,
        },
        area: {
            type: String,
            maxlength: 50,
            trim : true
        },
        pinCode: {
            type: String,
            maxlength: 6,
        },
        addressType: {
            type: String,
            default: "HOME",
            enum: ["HOME", "OFFICE", "BUSINESS"],
            required: true
        }
    }],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Users'
    }
}, {
    timestamps: true
})



UserPersonalSchema.statics.isPersonalDetailsExist = async function (userid) {

    const isUser = await UserPersonalDetails.findOne({
        user: userid
    });
    if (!isUser) {
        return {};
    } else {
        return isUser;
    }
}

UserPersonalSchema.methods.isValueExist = async function (value = Object, valueType = String, fieldName = String) {
    const userDetails = this;
    let providedType = value.hasOwnProperty(valueType) ? value[valueType] : 'HOME';
    let filterData = userDetails[fieldName].filter(item => {
        return item[valueType] === providedType;
    });
    if (filterData.length > 0) {
        filterData = filterData[0];
        for (let i in value) {
            filterData[i] = value[i]
        }
    } else {
        userDetails[fieldName] = userDetails[fieldName].concat(value);
    }
}



const UserPersonalDetails = mongoose.model('PersonalDetails', UserPersonalSchema);

module.exports = UserPersonalDetails;
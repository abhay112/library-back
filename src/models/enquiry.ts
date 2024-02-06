import mongoose from "mongoose";
import validator from "validator";


const schema = new mongoose.Schema(
    {

        name: {
            type: String,
            required: [true, "Please enter Name"],
        },
        email: {
            type: String,
            unique: [true, "Email already Exist"],
            required: [false, "Please enter Name"],
            validate: validator.default.isEmail,
        },
        mobile: {
            type: String,
            required: [true, "Please enter Mobile Number"],
            validate: validator.default.isMobilePhone,
        },
        gender: {
            type: String,
            required: [true, "Please enter gender"],
        },
        shift: {
            type: String,
            required: false,
        },
        message:{
            type:String,
            required:false,
        },
        adminId: {
            type: String,
            required: [true, "Admin Id required"],
        },

    },
    {
        timestamps: true,
    }
);

export const Enquiry = mongoose.model("Enquiry", schema);

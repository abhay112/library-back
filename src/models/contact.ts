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
      required: [true, "Please enter Name"],
      validate: validator.default.isEmail,
    },
    mobile: {
      type: String,
      required: [true, "Please enter Mobile Number"],
      validate: validator.default.isMobilePhone,
    },
    library: {
      type: String,
      required: [true, "Please enter Library Name"],
    },
    location:{
        type:String,
        required:false,
    }
  },
  {
    timestamps: true,
  }
);

export const Contact = mongoose.model("Contact", schema);

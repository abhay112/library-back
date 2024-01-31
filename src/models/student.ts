import mongoose from "mongoose";
import validator from "validator";


const schema = new mongoose.Schema(
  {
    adminId:{
      type:String,
      required: [true, "Admin Id required"],
    },
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
    photo: {
      type: String,
      required: [true, "Please enter Photo"],
    },
    library: {
      type: String,
      required:false,
    },
    attendance: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Student = mongoose.model("Student", schema);

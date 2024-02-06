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
      type: Number,
      required: [true, "Please enter Mobile Number"],
    },
    photo: {
      type: String,
      required: [true, "Please enter Photo"],
    },
    shift:{ //leter it modify to dropdown meny
      type:String, 
      required: [true, "Please enter Shift"],
    },
    feesAmount:{
      type:Number,
      required:[false,"Please enter Monthly Fees"]
    },
    library: {
      type: String,
      required:false,
    },
    attendance: {
      type: String,
      required: false,
    },
    active:{
      type:Boolean,
      required:false,
    }
  },
  {
    timestamps: true,
  }
);

export const Student = mongoose.model("Student", schema);

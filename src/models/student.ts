import mongoose from "mongoose";
import { Document } from "mongoose";

import validator from "validator";

interface IMembershipPeriod {
  startDate: Date;
  endDate?: Date; // `endDate` is optional because the student might still be active
  isActive: boolean;
}

interface IStudent extends Document {
  name: string;
  email: string;
  mobile: number;
  photo: string;
  shift: string;
  fixedSeatNumber: string;
  dateOfJoining?: string;
  feesId: mongoose.Schema.Types.ObjectId;
  libraryId: mongoose.Schema.Types.ObjectId; // Reference to Library
  adminId: string; // Reference to Admin
  attendance: mongoose.Schema.Types.ObjectId[];
  active?: boolean;
  membershipHistory: IMembershipPeriod[]; // Array to track membership periods
  createdAt: Date;
  updatedAt: Date;
}

const MembershipPeriodSchema = new mongoose.Schema({
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

const StudentSchema = new mongoose.Schema(
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
      required: false,
    },
    shift:{ //leter it modify to dropdown meny
      type:String, 
      required: [true, "Please enter Shift"],
    },
    fixedSeatNumber: {
      type: Number,
      required: false,
    },
    dateOfJoining: {
      type: String,
      required: false,
    },
    feesId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Fees",
      required: false,
    },
    libraryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Library",
      required: true,
    },
    // adminId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Admin",
    //   required: true,
    // },
    attendance: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Attendance",
      },
    ],
    active: {
      type: Boolean,
      default: true,
    },
    membershipHistory: {
      type: [MembershipPeriodSchema], // Array of membership periods
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const Student = mongoose.model("Student", StudentSchema);

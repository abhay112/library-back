import mongoose from "mongoose";
import validator from "validator";

interface AttendanceDocument extends Document {
    adminId: string;
    studentId: string;
    attendance: [
        {
            day:string,
            idx1:Number,
            idx2:Number,
            isPresent:string,
        }
    ];
    studentName:string;
  }

const schema = new mongoose.Schema(
  {
    adminId: {
      type: String,
      required: [true, "Please provide admin Id"],
    },
    studentId: {
      type: String,
      required: [true, "Please provide student Name"],
    },
    studentName:{
      type:String,
      required:[true,"Please enter Student Name"]
    },
    attendance: {
      type: Object,
      required: [true, "Please enter attendance"],
    },

  },
  {
    timestamps: true,
  }
);

export const Attendance = mongoose.model<AttendanceDocument>("Attendance", schema);

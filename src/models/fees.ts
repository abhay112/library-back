import mongoose from "mongoose";

interface FeesDocument extends Document {
  adminId: string;
  studentId: string;
  studentName: string;
  mobile: string;
  feesSubmissionDate: Date;
  fees: [
    {
      date: string,
      day: string,
      month: string,
      year: number,
      amount: number,
      feesStatus: boolean,
      shift: string;
    }
  ];
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
    studentName: {
      type: String,
      required: [true, "Please enter Student Name"]
    },
    mobile: {
      type: String,
      required: [true, "Please enter Mobile Number"],
    },
    feesSubmissionDate: {
      type: String,
      required: [true, "Please enter fees submission date"],
    },
    fees: {
      type: Object,
      required: [true, "Please enter attendance"],
    },

  },
  {
    timestamps: true,
  }
);

export const Fees = mongoose.model<FeesDocument>("Fees", schema);

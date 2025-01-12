import mongoose, { Document } from "mongoose";

interface ISeatDetail extends Document {
  seatNumber: number;
  status: "VACANT" | "FILLED" | "BLOCKED" | "FIXED" | "BLANK";
  studentId?: string;
  studentName?: string;
  attendanceId: string;
  createdAt: Date;
  updatedAt: Date;
}

const seatDetailSchema = new mongoose.Schema<ISeatDetail>(
  {
    seatNumber: { type: Number, required: true },
    status: { type: String, enum: ["VACANT", "FILLED", "BLOCKED", "FIXED", "BLANK"], default: "VACANT" },
    studentId: { type: String },
    studentName: { type: String },
    attendanceId: { type: String, required: true },
  },
  { timestamps: true }
);

export const SeatDetail = mongoose.model<ISeatDetail>("SeatDetail", seatDetailSchema);

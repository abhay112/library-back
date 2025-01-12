import mongoose, { Document } from "mongoose";

interface IAttendance extends Document {
  date: Date;
  adminId: string;
  studentId: string;
  studentName: string;
  filledSeats: string[]; // Array of seat numbers filled for attendance
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: Date;
  updatedAt: Date;
}

const attendanceSchema = new mongoose.Schema<IAttendance>(
  {
    date: { type: Date, required: true },
    adminId: { type: String, required: true },
    studentId: { type: String, required: true },
    studentName: { type: String, required: true },
    filledSeats: [{ type: String }],
    status: { type: String, enum: ["PENDING", "APPROVED", "REJECTED"], default: "PENDING" },
  },
  { timestamps: true }
);

export const Attendance = mongoose.model<IAttendance>("Attendance", attendanceSchema);

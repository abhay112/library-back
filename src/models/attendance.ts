import mongoose, { Document, Schema } from "mongoose";

interface AttendanceRecord {
  day: Date; // Store as Date for better query performance
  rowIndex: number; // Renamed for better clarity
  colIndex: number; // Renamed for better clarity
  isPresent: boolean; // Changed to boolean for simplicity
  seatNumber: number; // Optional reference to a seat if needed
  checkIn: Date; // Store as Date for time comparisons
  checkOut: Date; // Store as Date for time comparisons
  status: "pending" | "approved" | "rejected" | "break"; // Status of the attendance
  requestedByStudent: boolean; // Indicates if this attendance was requested by the student
  checkOutStatus:boolean;
  statusUpdateTime:Date;
}

interface AttendanceDocument extends Document {
  adminId: mongoose.Schema.Types.ObjectId;
  studentId: mongoose.Schema.Types.ObjectId;
  studentName: string;
  attendanceRecords: AttendanceRecord[]; 
}

const AttendanceRecordSchema = new mongoose.Schema<AttendanceRecord>(
  {
    day: {
      type: Date,
      required: true,
    },
    rowIndex: {
      type: Number,
      required: true,
    },
    colIndex: {
      type: Number,
      required: true,
    },
    isPresent: {
      type: Boolean,
      required: true,
    },
    seatNumber: {
      type: Number,
      required: true,
    },
    checkIn: {
      type: Date,
      required: false,
    },
    checkOut: {
      type: Date,
      required: false,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      required: true,
    },
    statusUpdateTime:{
      type: Date,
      required: false,
    },
    requestedByStudent: {
      type: Boolean,
      default: false,
      required: true,
    },
    checkOutStatus: {
      type: Boolean,
      default: false, // Default to false, indicating the student hasn't checked out
    },
  },
  { _id: false } 
);

const AttendanceSchema = new mongoose.Schema<AttendanceDocument>(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
      index: true, 
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      index: true, 
    },
    studentName: {
      type: String,
      required: [false, "Please enter Student Name"],
    },
    attendanceRecords: {
      type: [AttendanceRecordSchema],
      default: [], 
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

AttendanceSchema.index({
  adminId: 1, 
  studentId: 1, 
  'attendanceRecords.day': 1,
});

AttendanceSchema.index({
  'attendanceRecords.status': 1,
});

export const Attendance = mongoose.model<AttendanceDocument>("Attendance", AttendanceSchema);

import mongoose, { Document, Schema } from 'mongoose';

// Enum to track seat states
enum SeatStatus {
  VACANT = "vacant",
  FILLED = "filled",
  BLANK = "blank",
  FIXED = "fixed",
  BLOCKED = "blocked" 
}

// Interface for individual seat
interface ISeat {
  seatNumber:number,
  status: SeatStatus; 
  studentId?: mongoose.Schema.Types.ObjectId;
  studentName?: string; 
}

interface IAttendanceRecord {
    date: Date; // Make sure this property exists
    filledSeats: {
      seatNumber: number; // Seat number or identifier
      studentId: mongoose.Schema.Types.ObjectId; // Student occupying the seat
      studentName: string; // Name of the student
    }[];
  }

// Interface for the entire seating arrangement
interface ISeats extends Document {
    rows: number;
    columns: number;
    matrix: ISeat[][];
    adminId: mongoose.Schema.Types.ObjectId;
    attendanceRecords: IAttendanceRecord[]; // Use the defined interface here
    createdAt: Date;
    updatedAt: Date;
  }

// Seat Schema
const seatSchema = new Schema<ISeat>({
  seatNumber: { type: Number, required: true },
  status: { type: String, enum: Object.values(SeatStatus), default: SeatStatus.VACANT },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: false },
  studentName: { type: String, required: false }
}, { _id: false });

// Main Seats Schema
const seatsSchema = new Schema<ISeats>(
  {
    rows: {
      type: Number,
      required: [true, "Please enter the number of rows"],
    },
    columns: {
      type: Number,
      required: [true, "Please enter the number of columns"],
    },
    matrix: {
      type: [[seatSchema]],
      required: [true, "Please enter the seat matrix"],
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    attendanceRecords: [{
      date: { type: Date, required: true },
      filledSeats: [{
        seatNumber: { type: Number, required: true },
        studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
        studentName: { type: String, required: true }
      }]
    }]
  },
  { timestamps: true }
);

const Seats = mongoose.model<ISeats>('Seats', seatsSchema);
export default Seats;

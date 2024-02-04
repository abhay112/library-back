import mongoose, { Document, Schema, Types } from 'mongoose';

interface ISeats extends Document {
    matrix: number;
    seats: number[][];
    filledSeats: {
        day:string;
        idx1: number;
        idx2: number;
        isPresent:string;
        studentId: string;
        studentName: string;
    }[];
    adminId: string;
    createdAt: Date;
    updatedAt: Date;
}

const seatsSchema = new Schema<ISeats>(
    {
        matrix: {
            type: Number,
            required: [true, "Please enter matrix"],
        },
        seats: {
            type: [[Number]],
            required: [true, "Please enter seats"],
        },
        filledSeats: {
            type: [
                {
                    day:String,
                    idx1: Number,
                    idx2: Number,
                    isPresent:String,
                    studentId: String,
                    studentName: String,
                },
            ],
        },
        adminId: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

const Seats = mongoose.model<ISeats>('Seats', seatsSchema);

export default Seats;

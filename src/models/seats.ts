import mongoose, { Document } from "mongoose";

interface ISeat extends Document {
  rows: number;
  columns: number;
  matrix: Record<string, unknown>; // Representing seat layout in JSON
  adminId: string;
  createdAt: Date;
  updatedAt: Date;
}

const seatSchema = new mongoose.Schema<ISeat>(
  {
    rows: { type: Number, required: true },
    columns: { type: Number, required: true },
    matrix: { type: mongoose.Schema.Types.Mixed, required: true },
    adminId: { type: String, required: true },
  },
  { timestamps: true }
);

export const Seat = mongoose.model<ISeat>("Seat", seatSchema);

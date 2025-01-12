import mongoose, { Document } from "mongoose";

interface IStudent extends Document {
  name: string;
  email: string;
  mobile: string;
  photo?: string;
  shift: string;
  fixedSeatNumber?: number;
  dateOfJoining?: Date;
  feesId?: string;
  libraryId: string;
  adminId: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const studentSchema = new mongoose.Schema<IStudent>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true },
    photo: { type: String },
    shift: { type: String, required: true },
    fixedSeatNumber: { type: Number },
    dateOfJoining: { type: Date },
    feesId: { type: String },
    libraryId: { type: String, required: true },
    adminId: { type: String, required: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Student = mongoose.model<IStudent>("Student", studentSchema);

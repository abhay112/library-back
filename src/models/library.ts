import mongoose, { Document } from "mongoose";

interface ILibrary extends Document {
  name: string;
  address: string;
  pincode: number;
  students: mongoose.Schema.Types.ObjectId[]; // Array of ObjectId references to Student
  user?: mongoose.Schema.Types.ObjectId; // Optional reference to a single User
  admins: mongoose.Schema.Types.ObjectId[]; // Array of ObjectId references to Admin
  createdAt: Date;
  updatedAt: Date;
}

const librarySchema = new mongoose.Schema<ILibrary>(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    pincode: { type: Number, required: true },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    admins: [{ type: mongoose.Schema.Types.ObjectId, ref: "Admin" }],
  },
  { timestamps: true }
);

export const Library = mongoose.model<ILibrary>("Library", librarySchema);

import mongoose, { Document, Schema } from "mongoose";

interface ILibrary extends Document {
  _id: string;
  name: string;
  address: string;
  pincode:number;
  students: mongoose.Schema.Types.ObjectId[]; // Reference to Students
  admins: mongoose.Schema.Types.ObjectId[]; // Reference to Admins
  createdAt: Date;
  updatedAt: Date;
}

const LibrarySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter Library Name"],
    },
    pincode:{
        type:Number,
        required: [true, "Please enter pincode Name"],
    },
    address: {
      type: String,
      required: [true, "Please enter Address"],
    },
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
    admins: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Library = mongoose.model<ILibrary>("Library", LibrarySchema);

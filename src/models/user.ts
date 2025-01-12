import mongoose, { Document } from "mongoose";

interface IUser extends Document {
  name: string;
  email: string;
  photo?: string;
  role: "USER" | "ADMIN";
  libraryId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    photo: { type: String },
    role: { type: String, enum: ["USER", "ADMIN"], default: "USER" },
    libraryId: { type: String },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", userSchema);

import mongoose, { Document } from "mongoose";

interface IMembershipPeriod extends Document {
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
  studentId: string;
  createdAt: Date;
  updatedAt: Date;
}

const membershipPeriodSchema = new mongoose.Schema<IMembershipPeriod>(
  {
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    isActive: { type: Boolean, default: true },
    studentId: { type: String, required: true },
  },
  { timestamps: true }
);

export const MembershipPeriod = mongoose.model<IMembershipPeriod>("MembershipPeriod", membershipPeriodSchema);

import mongoose, { Document } from "mongoose";

interface FeeDetail {
  date: string;
  amount: number;
  feesStatus: boolean;
  shift: 'morning' | 'afternoon' | 'evening' | 'full_day';
}

interface FeesDocument extends Document {
  adminId: mongoose.Schema.Types.ObjectId; // Reference to Admin
  studentId: mongoose.Schema.Types.ObjectId; // Reference to Student
  studentName: string;
  mobile: string;
  feesSubmissionDate: Date;
  feesDueDate: Date;
  fees: FeeDetail[];
  createdAt: Date;
  updatedAt: Date;
}

const FeeDetailSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: [true, "Please enter date"],
    },
    amount: {
      type: Number,
      required: [true, "Please enter amount"],
    },
    feesStatus: {
      type: Boolean,
      required: [true, "Please specify fees status"],
    },
    shift: {
      type: String,
      enum: ['morning', 'afternoon', 'evening', 'full_day'],
      required: [true, "Please specify the shift"],
    },
  },
  {
    _id: false, // Prevent the creation of an _id field for each fee detail
  }
);

const FeesSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: [true, "Please provide admin ID"],
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: [true, "Please provide student ID"],
    },
    studentName: {
      type: String,
      required: [true, "Please enter student name"],
    },
    feesSubmissionDate: {
      type: Date,
      required: [true, "Please enter fees submission date"],
    },
    feesDueDate: {
      type: Date,
      required: false,
    },
    fees: {
      type: [FeeDetailSchema],
      required: [true, "Please enter fees details"],
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Pre-save hook to calculate feesDueDate
FeesSchema.pre<FeesDocument>('save', function(next) {
  if (this.feesSubmissionDate) {
    const submissionDate = this.feesSubmissionDate as Date;
    const dueDate = new Date(submissionDate);
    dueDate.setMonth(submissionDate.getMonth() + 1);
    this.feesDueDate = dueDate;
  }
  next();
});
export const Fees = mongoose.model<FeesDocument>("Fees", FeesSchema);

import mongoose, { CallbackError } from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

interface IAdmin extends mongoose.Document {
    _id: string;
    name: string;
    email: string;
    password: string;
    library: string;
    createdAt: Date;
    updatedAt: Date;
}

const schema = new mongoose.Schema(
    {
        _id: {
            type: String,
            required: [true, "Please enter ID"],
        },
        name: {
            type: String,
            required: [false, "Please enter Name"],
        },
        email: {
            type: String,
            unique: [true, "Email already Exist"],
            required: [true, "Please enter Name"],
            validate: validator.default.isEmail,
        },
        password: {
            type: String,
            required: [true, "Please enter Password"],
        },
        library: {
            type: String,
            required: [false, "Please enter library name"],
        },
    },
    {
        timestamps: true,
    }
);

// Hash password before saving to the database
schema.pre<IAdmin>("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    try {
        const hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
        return next();
    }  catch (error: any) {
        return next(error as CallbackError);
    }
});

export const Admin = mongoose.model<IAdmin>("Admin", schema);

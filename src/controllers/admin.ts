import { NextFunction, Request, Response } from "express";
import { NewAdminRequestBody } from "../types/types.js";
import { TryCatch } from "../middlewares/error.js";
import { Admin } from "../models/admin.js";
import bcrypt from 'bcrypt';
import ErrorHandler from "../utils/utility-class.js";

export const adminSignUp = TryCatch(
    async (
        req: Request<{}, {}, NewAdminRequestBody>,
        res: Response,
        next: NextFunction
    ) => {
        const { name, email, password, library, _id } = req.body;
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin with this email already exists' });
        }
        const newAdmin = new Admin({
            _id,
            name,
            email,
            password,
            library,
        });

        await newAdmin.save();
        return res.status(201).json({
            success: true,
            message: `Welcome, ${newAdmin.name}`,
        });
    }
);

export const adminSignIn = TryCatch(
    async (
        req: Request<{}, {}, { email: string, password: string }>,
        res: Response,
        next: NextFunction
    ) => {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const passwordMatch = await bcrypt.compare(password, admin.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        return res.status(200).json({
            success: true,
            message: 'Admin signed in successfully',
            adminId: admin._id,
        });
    }
);

// export const getAllUsers = TryCatch(async (req, res, next) => {
//     const users = await User.find({});
//     return res.status(200).json({
//         success: true,
//         users,
//     });
// });

export const getAdmin = TryCatch(async (req, res, next) => {
    const id = req.params.id;
    const admin = await Admin.findById(id);

    if (!admin) return next(new ErrorHandler("Invalid Id", 400));
    return res.status(200).json({
        success: true,
        admin,
    });
});


// export const deleteUser = TryCatch(async (req, res, next) => {
//     const id = req.params.id;
//     const user = await User.findById(id);

//     if (!user) return next(new ErrorHandler("Invalid Id", 400));

//     await user.deleteOne();

//     return res.status(200).json({
//         success: true,
//         message: "User Deleted Successfully",
//     });
// });

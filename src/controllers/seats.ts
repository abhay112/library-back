import { NextFunction, Request, Response } from "express";

import { FetchSeatRequestBody, NewAttendanceRequestBody, NewSeatRequestBody, ParamTypes } from "../types/types.js";
import { TryCatch } from "../middlewares/error.js";
import Seats from "../models/seats.js";
import { Attendance } from "../models/attendance.js";
import { Student } from "../models/student.js";
import { User } from "../models/user.js";
import { Types } from "mongoose";
import { Admin } from "../models/admin.js";

export const createSeats = TryCatch(
    async (req: Request<{}, {}, NewSeatRequestBody>, res: Response, next: NextFunction) => {
        const { rows,columns, matrix } = req.body;
        let adminId = req.query.id;
        let findSeats = await Seats.findOne({ adminId: adminId });
        if (!findSeats) {
            const newSeat = await Seats.create({
                rows,
                columns,
                matrix,
                adminId: adminId,
            });
            res.status(201).json({
                success: true,
                message: "Seat created successfully",
            });
        } else {
            const updatedSeat = await Seats.findOneAndUpdate(
                { adminId: adminId },
                { rows,columns, matrix },
                { new: true } // to return the updated seat
            );
            res.status(200).json({
                success: true,
                message: "Seat updated successfully",
                data: updatedSeat,
            });
        }
    }
);
export const fetchFilledSeats = TryCatch(
    async (req,res,next) => {
        const { id } = req.params;
        let studentId: Types.ObjectId;
        const user = await User.findOne({ _id: id });
        let adminId;
        if (user) {
            const student = await Student.findOne({ email: user.email });
            if (student) {
                studentId = student._id;
                adminId = student?.adminId;
            } else {
                return res.status(404).json({
                    success: false,
                    message: "Student not found",
                });
            }
        } else {
            const admin = await Admin.findOne({_id:id});
            if(admin){
                adminId= admin?._id;
            }
        }

        const attendances = await Attendance.find({ adminId });
        const currentDate = new Date();
        const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
        let result = attendances.map((attendance) => {
            const latestAttendance = attendance.attendance[attendance.attendance.length - 1];
            if (latestAttendance.day === formattedDate) {
                return {
                    studentId,
                    studentName: attendance.studentName,
                    ...latestAttendance,
                };
            }
        });
        result = result.filter((item) => item !== undefined);
        const updatedSeat = await Seats.findOneAndUpdate(
            { adminId},
            { $set: { filledSeats: result } },
            { new: true }
        );
        return res.status(200).json({
            success: true,
            data: updatedSeat,
        });
    }
);

export const fetchSeatLayout = TryCatch(
    async (req,res,next) => {
        const { id } = req.params;
        let seatLayout;
        try {
            const user = await User.findOne({ _id: id });
            if (user) {
                const student = await Student.findOne({ email: user.email });
                if (student) {
                    seatLayout = await Seats.findOne({ adminId: student.adminId });
                }
            } else {
                seatLayout = await Seats.findOne({ adminId: id }); // when admin is logged in
            }

            if (!seatLayout) {
                return res.status(404).json({
                    success: false,
                    message: "Seat layout not found",
                });
            }

            return res.status(200).json({
                success: true,
                data: seatLayout,
            });
        } catch (error) {
            console.error("Error fetching seat layout:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    }
);





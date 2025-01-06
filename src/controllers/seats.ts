import { NextFunction, Request, Response } from "express";

import { FetchSeatRequestBody, NewAttendanceRequestBody, NewSeatRequestBody, ParamTypes } from "../types/types.js";
import { TryCatch } from "../middlewares/error.js";
import Seats from "../models/seats.js";
import { Attendance } from "../models/attendance.js";

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

// fetch seats for current Date;
export const fetchFilledSeats = TryCatch(
    async (req: Request<{}, {}, FetchSeatRequestBody>, res: Response, next: NextFunction) => {
        const {id} = req.query;
        const attendances = await Attendance.find({adminId:id});
        const currentDate = new Date();
        const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
        let result = attendances.map((attendance) => {
          const { studentId, adminId, studentName } = attendance;
          const latestAttendance = (attendance as any).attendance[(attendance as any).attendance.length - 1];
          if (latestAttendance.day === formattedDate) {
            return {
              studentId,
              studentName,
              ...latestAttendance,
            };
          }
        });
        result = result.filter((item) => item !== undefined);
        console.log(result);
        const updatedSeat = await Seats.findOneAndUpdate(
            { adminId: id },
            { $set: { filledSeats: result } },
            { new: true }
        );
        console.log(updatedSeat);
        return res.status(200).json({
            success: true,
            data: updatedSeat,
          });
    }
);
export const fetchSeatLayout = TryCatch(
    async (req: Request<{}, {}, FetchSeatRequestBody>, res: Response, next: NextFunction) => {
        const {id} = req.query;
        const seatLayout = await Seats.findOne({ adminId: id });
        if (!seatLayout) {
            return res.status(404).json({
                success: false,
                message: "Seat layout not found",
            });
        }
        // Return seat layout data
        return res.status(200).json({
            success: true,
            data: seatLayout,
        });
        
    }
)




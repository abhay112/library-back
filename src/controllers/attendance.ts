import { NextFunction, Request, Response } from "express";
import { Attendance } from "../models/attendance.js";
import { Student } from "../models/student.js";
import { NewAttendanceRequestBody, ParamTypes } from "../types/types.js";
import { TryCatch } from "../middlewares/error.js";


export const newAttendance = TryCatch(
  async (
    req: Request<{}, {}, NewAttendanceRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    const { idx1, idx2 } = req.body;
    const currentDate = new Date();
    const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
    const { id } = req.params;
    console.log(id);
    const attendanceFound = await Attendance.findOne({ studentId: id });
    if(attendanceFound){
      await Attendance.updateOne(
        { studentId: id },
        {
          $addToSet: {
            attendance: { day: formattedDate, idx1, idx2, isPresent: "Pending" },
          },
        }
      );
      return res.status(201).json({
        success: true,
        message: `Attendance for ${formattedDate} requested and updated successfully`,
      });
    }
    
  }
);
export const attendanceApproved = TryCatch(
  async (
    req: Request<{}, {}, NewAttendanceRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    const { studentId } = req.body;
    const attendanceFound = await Attendance.findOne({ studentId:studentId });
    if (attendanceFound) {
      const latestAttendance = attendanceFound.attendance.slice(-1)[0];
      if (latestAttendance.isPresent === "Pending") {
        await Attendance.updateOne(
          { studentId },
          { $set: { 'attendance.$[elem].isPresent': 'Present' } },
          { arrayFilters: [{ 'elem.day': latestAttendance.day }] }
        );
        return res.status(201).json({
          success: true,
          message: `Latest attendance for ${studentId} updated to "Present"`,
        });
      } else {
        return res.status(400).json({
          success: false,
          message: `Latest attendance for ${studentId} is already "Present" or not found`,
        });
      }
    } else {
      return res.status(404).json({
        success: false,
        message: `Attendance not found for studentId: ${studentId}`,
      });
    }
  }
);


export const getAllStudentTodayAttendance = TryCatch(
  async (
    req: Request<{}, {}, NewAttendanceRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    const attendances = await Attendance.find({});
    const currentDate = new Date();
    const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;

    let result = attendances.map((attendance) => {
      const { studentId, adminId, studentName } = attendance;
      const latestAttendance = attendance.attendance[attendance.attendance.length - 1];
      if (latestAttendance.day === formattedDate) {
        return {
          studentId,
          adminId,
          studentName,
          latestAttendance,
        };
      }
    });

    // Filter out undefined results
    result = result.filter((item) => item !== undefined);

    return res.status(200).json({
      success: true,
      data: result,
    });
  }
);


export const getPresentStudent = TryCatch(
  async (
    req: Request<{}, {}, NewAttendanceRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    const attendances = await Attendance.find({});
    let result = attendances.map((attendance) => {
      const { studentId, adminId, studentName } = attendance;
      const latestAttendance = attendance.attendance[attendance.attendance.length - 1];
      const currentDate = new Date();
      const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
      // Remove the semicolon after the condition
      if (latestAttendance.isPresent === "Present" && latestAttendance.day === formattedDate) {
        return {
          studentId,
          adminId,
          studentName,
          latestAttendance,
        };
      }
    });
    result = result.filter((item) => item !== undefined);
    return res.status(200).json({
      success: true,
      data: result,
    });
  }
)

export const getPendingAttendance = TryCatch(
  async (
    req: Request<{}, {}, NewAttendanceRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    const attendances = await Attendance.find({});
    let result = attendances.map((attendance) => {
      const { studentId, adminId, studentName } = attendance;
      const latestAttendance = attendance.attendance[attendance.attendance.length - 1];
      const currentDate = new Date();
      const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
      if (latestAttendance.isPresent === "Pending" && latestAttendance.day === formattedDate) {
        return {
          studentId,
          adminId,
          studentName,
          latestAttendance,
        };
      }
    });
    result = result.filter((item) => item !== undefined);
    return res.status(200).json({
      success: true,
      data: result,
    });
  }
);

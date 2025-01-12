import { NextFunction, Request, Response } from "express";
import { Attendance } from "../models/attendance.js";
import { NewAttendanceRequestBody, ParamTypes } from "../types/types.js";
import { TryCatch } from "../middlewares/error.js";
// import Seats from "../models/seats.js";
import ErrorHandler from "../utils/utility-class.js";
import { Student } from "../models/student.js";


// export const newAttendance = TryCatch(
//   async (req, res, next) => {
//     const { idx1, idx2 } = req.body;
//     const {id} = req.params;
//     const findStudent = await Student.findOne({_id:id});
//     if(findStudent){
//       const adminId = findStudent?.adminId
//       const currentDate = new Date();
//       const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
//       const fetchSeat = await Seats.findOne({ adminId: adminId });
//       console.log(fetchSeat);
//       const seatNumber = fetchSeat?.matrix[idx1][idx2];
//       const attendanceFound = await Attendance.findOne({ studentId: id, adminId: adminId });
//       // const seatAlready = attendanceFound?.attendance.slice(-1)[0]?.seatNumber;
//       const seatAlready = (attendanceFound as any)?.attendance.slice(-1)[0]?.seatNumber;
//       // const seatAlready = 1;
//       if (seatAlready === seatNumber) {
//         return res.status(201).json({
//           success: false,
//           message: `Seat already taken`,
//         });
//       }
//       else if (attendanceFound && seatAlready !== seatNumber) { //corect this condition 
//         await Attendance.updateOne(
//           { studentId: id },
//           {
//             $addToSet: {
//               attendance: { day: formattedDate, idx1, idx2, isPresent: "Pending", seatNumber: seatNumber },
//             },
//           }
//         );
//         return res.status(201).json({
//           success: true,
//           message: `Attendance for ${formattedDate},and seatNumber is ${seatNumber} requested and updated successfully`,
//         });
//       } else {
//         return res.status(201).json({
//           success: false,
//           message: `Student not Found for this admin`,
//         });
//       }
//     }else{
//       return res.status(201).json({
//         success: false,
//         message: `Student not Found for this admin`,
//       });
//     }
   
//   }
// );

// // Controller attendance
// export const attendanceApproved = TryCatch(
//   async (req, res, next) => {
//     const { id } = req.params;
//     const adminId = req.query.id;
//     const attendanceFound = await Attendance.findOne({ studentId: id });

//     if (attendanceFound) {
//       // const latestAttendance = attendanceFound.attendance.slice(-1)[0];
//       const latestAttendance = (attendanceFound as any)?.attendance.slice(-1)[0];
//       if (latestAttendance.isPresent === "Pending") {
//         await Attendance.updateOne(
//           {
//             studentId: id,
//           },
//           { $set: { 'attendance.$[elem].isPresent': 'Present' } },
//           { arrayFilters: [{ 'elem.day': latestAttendance.day }] }
//         );

//         return res.status(201).json({
//           success: true,
//           message: `Latest attendance for ${id} updated to "Present" `,
//         });
//       } else {
//         return res.status(400).json({
//           success: false,
//           message: `Latest attendance for ${id} is already "Present" or not found`,
//         });
//       }
//     } else {
//       return res.status(404).json({
//         success: false,
//         message: `Attendance not found for studentId: ${id}`,
//       });
//     }
//   }
// );

// //it will return all student that are present and their attendace pending 
// // export const getAllStudentTodayAttendance = TryCatch(
// //   async (
// //     req: Request<{}, {}, NewAttendanceRequestBody>,
// //     res: Response,
// //     next: NextFunction
// //   ) => {
// //     const adminId = req.query.id
// //     const attendances = await Attendance.find({ adminId: adminId });
// //     const currentDate = new Date();
// //     const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;

// //     let result = attendances.map((attendance) => {
// //       const { studentId, adminId, studentName } = attendance;
// //       const latestAttendance = attendance.attendance[attendance.attendance.length - 1];
// //       if (latestAttendance.day === formattedDate) {
// //         return {
// //           studentId,
// //           adminId,
// //           studentName,
// //           latestAttendance,
// //         };
// //       } else {
// //         return {
// //           studentId,
// //           adminId,
// //           studentName,
// //           latestAttendance: { day: formattedDate, idx1: null, idx2: null, isPresent: "Not Present",seatNumber:null },
// //         };
// //       }
// //     });

// //     // Filter out undefined results
// //     result = result.filter((item) => item !== undefined);

// //     return res.status(200).json({
// //       success: true,
// //       data: result,
// //     });
// //   }
// // );

// export const getAllStudentTodayAttendance = TryCatch(
//   async (
//     req: Request<{}, {}, NewAttendanceRequestBody>,
//     res: Response,
//     next: NextFunction
//   ) => {
//     const adminId = req.query.id;
//     const currentDate = new Date();
//     const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
//     const activeStudents = await Student.find({ adminId: adminId, active: true });
//     const activeStudentIds = activeStudents.map(student => String(student._id));
//     // console.log(activeStudentIds);
//     const aggregatedAttendance = await Attendance.aggregate([
//       {
//         $match: {
//           adminId: adminId,
//           studentId: { $in: activeStudentIds }
//         }
//       }
//     ]);
//     // console.log(aggregatedAttendance);

//     // Format the result
//     let result = aggregatedAttendance.map((attendance) => {
//       const { studentId, adminId, studentName } = attendance;
//             const latestAttendance = attendance.attendance[attendance.attendance.length - 1];
//             if (latestAttendance.day === formattedDate) {
//               return {
//                 studentId,
//                 adminId,
//                 studentName,
//                 latestAttendance,
//               };
//             } else {
//               return {
//                 studentId,
//                 adminId,
//                 studentName,
//                 latestAttendance: { day: formattedDate, idx1: null, idx2: null, isPresent: "Not Present",seatNumber:null },
//               };
//             }
//     });
//     //  Filter out undefined results
//     result = result.filter((item) => item !== undefined);

//     return res.status(200).json({
//       success: true,
//       data: result,
//     });
//   }
// );
// export const getStudentAllAttendance = TryCatch(
//   async (req, res, next) => {
//     const adminId = req.query.id;
//     const studentId = req.params.id;
//     const attendance = await Attendance.findOne({ adminId: adminId, studentId: studentId });
//     console.log(attendance, 'attendance');
//     if (attendance) {
//       return res.status(200).json({
//         success: true,
//         data: attendance,
//       });
//     } else {
//       return res.status(401).json({
//         success: false,
//         message: "attendancne not found",
//       });
//     }
//   })


// // this only return present student
// export const getPresentStudent = TryCatch(
//   async (
//     req: Request<{}, {}, NewAttendanceRequestBody>,
//     res: Response,
//     next: NextFunction
//   ) => {
//     const adminId = req.query.id
//     const attendances = await Attendance.find({ adminId: adminId });
//     let result = attendances.map((attendance) => {
//       const { studentId, adminId, studentName } = attendance;
//       // const latestAttendance = attendance.attendance[attendance.attendance.length - 1];
//       const latestAttendance = (attendance as any).attendance[(attendance as any).attendance.length - 1];

//       const currentDate = new Date();
//       const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
//       // Remove the semicolon after the condition
//       if (latestAttendance.isPresent === "Present" && latestAttendance.day === formattedDate) {
//         return {
//           studentId,
//           adminId,
//           studentName,
//           latestAttendance,
//         };
//       }
//     });
//     result = result.filter((item) => item !== undefined);
//     return res.status(200).json({
//       success: true,
//       data: result,
//     });
//   }
// )

// export const getPendingAttendance = TryCatch(
//   async (
//     req: Request<{}, {}, NewAttendanceRequestBody>,
//     res: Response,
//     next: NextFunction
//   ) => {
//     const attendances = await Attendance.find({});
//     let result = attendances.map((attendance) => {
//       const { studentId, adminId, studentName } = attendance;
//       // const latestAttendance = attendance.attendance[attendance.attendance.length - 1];
//       const latestAttendance = (attendance as any).attendance[(attendance as any).attendance.length - 1];

//       const currentDate = new Date();
//       const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
//       if (latestAttendance.isPresent === "Pending" && latestAttendance.day === formattedDate) {
//         return {
//           studentId,
//           adminId,
//           studentName,
//           latestAttendance,
//         };
//       }
//     });
//     result = result.filter((item) => item !== undefined);
//     return res.status(200).json({
//       success: true,
//       data: result,
//     });
//   }
// );

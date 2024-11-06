import { NextFunction, Request, Response } from 'express';
import {adminService,libraryService} from '../../services/admin/admin.service.js';
import {studentService} from '../../services/admin/students.service.js';
import {attendanceService} from '../../services/admin/attendance.service.js';

import { StatusCodes } from 'http-status-codes';
import { TryCatch } from '../../middlewares/error.js';
import { seatsService } from '../../services/admin/seats.service.js';

//: Admin CRUD controllers
const AdminController:any = {
  createAdmin: TryCatch(async (req: Request, res: Response, next: NextFunction) => {
    const result = await adminService.createAdmin(req.body);
    return res.status(result.success ? StatusCodes.CREATED : StatusCodes.BAD_REQUEST).json(result);
  }),

  fetchAdmins: TryCatch(async (req: Request, res: Response, next: NextFunction) => {
    const admins = await adminService.fetchAdmins();
    return res.status(StatusCodes.OK).json({ success: true, admins });
  }),

  getAdminById: TryCatch(async (req: Request, res: Response, next: NextFunction) => {
    const admin = await adminService.fetchAdminById(req.params.id);
    return res.status(StatusCodes.OK).json({ success: true, admin });
  }),

  updateAdmin: TryCatch(async (req: Request, res: Response, next: NextFunction) => {
    const updatedAdmin = await adminService.updateAdmin(req.params.id, req.body);
    return res.status(StatusCodes.OK).json({ success: true, admin: updatedAdmin });
  }),

  deleteAdmin: TryCatch(async (req: Request, res: Response, next: NextFunction) => {
    await adminService.deleteAdmin(req.params.id);
    return res.status(StatusCodes.NO_CONTENT).send(); // 204 No Content
  }),
};


//: Library CRUD controllers
const LibraryController: any = {
    // Create Library
    createLibrary: TryCatch(async (req: Request, res: Response, next: NextFunction) => {
      const result = await libraryService.createLibrary(req.body);
      return res.status(result.success ? StatusCodes.CREATED : StatusCodes.BAD_REQUEST).json(result);
    }),
  
    // Fetch All Libraries
    fetchLibraries: TryCatch(async (req: Request, res: Response, next: NextFunction) => {
      const result = await libraryService.fetchLibraries();
      return res.status(StatusCodes.OK).json(result);
    }),
  
    // Fetch Library by ID
    getLibraryById: TryCatch(async (req: Request, res: Response, next: NextFunction) => {
      const result = await libraryService.fetchLibraryById(req.params.id);
      return res.status(StatusCodes.OK).json(result);
    }),
  
    // Update Library
    updateLibrary: TryCatch(async (req: Request, res: Response, next: NextFunction) => {
      const result = await libraryService.updateLibrary(req.params.id, req.body);
      return res.status(StatusCodes.OK).json(result);
    }),
  
    // Delete Library
    deleteLibrary: TryCatch(async (req: Request, res: Response, next: NextFunction) => {
      await libraryService.deleteLibrary(req.params.id);
      return res.status(StatusCodes.NO_CONTENT).send(); // 204 No Content
    }),
};


//: Student CRUD controllers
const StudentController: any = {
  // Create Student
  createStudent: TryCatch(async (req: Request, res: Response, next: NextFunction) => {
    const result = await studentService.createStudent(req.body);
    return res.status(result.success ? StatusCodes.CREATED : StatusCodes.BAD_REQUEST).json(result);
  }),

  // Fetch All Students
  fetchStudents: TryCatch(async (req: Request, res: Response, next: NextFunction) => {
    const result = await studentService.fetchStudents(req?.params.adminId);
    return res.status(StatusCodes.OK).json(result);
  }),

  // Fetch Student by ID
  getStudentById: TryCatch(async (req: Request, res: Response, next: NextFunction) => {
    const result = await studentService.fetchStudentById(req.params.id);
    return res.status(StatusCodes.OK).json(result);
  }),

  // Update Student
  updateStudent: TryCatch(async (req: Request, res: Response, next: NextFunction) => {
    const result = await studentService.updateStudent(req.params.id, req.body);
    return res.status(StatusCodes.OK).json(result);
  }),

  updateStudentMembership: TryCatch(async (req: Request, res: Response, next: NextFunction) => {
    const { studentId } = req.params;
    const membershipData = req.body;
    const result = await studentService.updateStudentMembership(studentId, membershipData);
    return res.status(result.success ? StatusCodes.OK : StatusCodes.BAD_REQUEST).json(result);
  }),

  // Delete Student
  deleteStudent: TryCatch(async (req: Request, res: Response, next: NextFunction) => {
    await studentService.deleteStudent(req.params.id);
    return res.status(StatusCodes.NO_CONTENT).send(); // 204 No Content
  }),
};


const AttendanceController: any = {
  // this is for student only
  createAttendance: TryCatch(async (req: Request, res: Response, next: NextFunction) => {
    const { studentId,adminId, attendanceRecords } = req.body;

    // Fetch student details
    const { success, student } = await studentService.fetchStudentById(studentId);

    if (!success || !student || !student._id || !student.libraryId) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: "Student is not assigned to any library",
        });
    }

    // Delegate attendance creation logic to the service
    const result = await attendanceService.createAttendance(studentId,adminId, attendanceRecords);

    return res
        .status(result.success ? StatusCodes.CREATED : StatusCodes.BAD_REQUEST)
        .json(result);
  }),

  //apprve or reject
  performActionOnAttendance: TryCatch(async (req: Request, res: Response, next: NextFunction) => {
    const { action } = req.body; // expects 'approve' or 'reject'
    const { attendanceId } = req.params; // attendance record ID

    if (!["approve", "reject"].includes(action)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Invalid action. Must be either 'approve' or 'reject'.",
      });
    }

    const result = await attendanceService.performActionOnAttendance(attendanceId, action);
    
    return res.status(result.success ? StatusCodes.OK : StatusCodes.BAD_REQUEST).json(result);
  }),

  // this is for student only
  checkOutStudent: TryCatch(async (req: Request, res: Response, next: NextFunction) => {
    const { studentId, attendanceId } = req.body; // Expect attendanceId in the request body

    const result = await attendanceService.checkOutStudent(studentId, attendanceId);

    return res.status(result.success ? StatusCodes.OK : StatusCodes.BAD_REQUEST).json(result);  
  }),

  // Fetch All Attendance Records
  fetchAttendances: TryCatch(async (req: Request, res: Response, next: NextFunction) => {
    const result = await attendanceService.fetchAttendances(req.query);
    return res.status(StatusCodes.OK).json(result);
  }),
  // fetch pending attendance
  fetchPendingAttendances: TryCatch(async (req: Request, res: Response, next: NextFunction) => {
    const { adminId, studentId } = req.query;

    const filter = {
        adminId,
        studentId,
        'attendanceRecords.status': 'pending',
        'attendanceRecords.isPresent': true, // Optional filter
    };

    const result = await attendanceService.fetchAttendances(filter);
    return res.status(StatusCodes.OK).json(result);
  }),

  // Fetch Attendance Record by Student ID
  getAttendanceByStudentId: TryCatch(async (req: Request, res: Response, next: NextFunction) => {
    // const result = await attendanceService.fetchAttendanceByStudentId();
    // return res.status(StatusCodes.OK).json(result);
  }),

  // Update Attendance Record
  updateAttendance: TryCatch(async (req: Request, res: Response, next: NextFunction) => {
    const result = await attendanceService.updateAttendance(req.params.id, req.body);
    return res.status(StatusCodes.OK).json(result);
  }),

  // Delete Attendance Record
  deleteAttendance: TryCatch(async (req: Request, res: Response, next: NextFunction) => {
    await attendanceService.deleteAttendance(req.params.id);
    return res.status(StatusCodes.NO_CONTENT).send(); // 204 No Content
  }),
};


const SeatsController: any = {
  // Create Seats
  createSeats: TryCatch(async (req: Request, res: Response, next: NextFunction) => {
    const result = await seatsService.createSeats(req.body);
    return res.status(result.success ? StatusCodes.CREATED : StatusCodes.BAD_REQUEST).json(result);
  }),

  // Fetch All Seats
  fetchSeats: TryCatch(async (req: Request, res: Response, next: NextFunction) => {
    const result = await seatsService.fetchSeats(req.body.adminId);
    return res.status(StatusCodes.OK).json(result);
  }),

  // Fetch Seat by ID
  getSeatById: TryCatch(async (req: Request, res: Response, next: NextFunction) => {
    const result = await seatsService.getSeatById(req.params.id);
    return res.status(StatusCodes.OK).json(result);
  }),

  // Update Seat
  updateSeat: TryCatch(async (req: Request, res: Response, next: NextFunction) => {
    const result = await seatsService.updateSeat(req.params.id, req.body);
    return res.status(StatusCodes.OK).json(result);
  }),

  // Delete Seat
  deleteSeat: TryCatch(async (req: Request, res: Response, next: NextFunction) => {
    await seatsService.deleteSeat(req.params.id);
    return res.status(StatusCodes.NO_CONTENT).send(); // 204 No Content
  }),
};





export  {AdminController,LibraryController,StudentController, AttendanceController,SeatsController};

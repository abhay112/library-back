import express from 'express';
import {AttendanceController} from '../../controllers/admin/admin.controller.js'; 

const router = express.Router();

// Create a new attendance
router.post("/attendance", AttendanceController.createAttendance);

//checkout requset by student
router.post("/attendance/checkout", AttendanceController.checkOutStudent);

// Fetch the list of attendance
router.get("/attendance", AttendanceController.fetchAttendances);
router.get('/attendances/pending', AttendanceController.fetchPendingAttendances)


// Fetch a single attendance by ID
router.get("/attendance/:id", AttendanceController.getAttendanceByStudentId);

// Update an attendance by ID
router.put("/attendance/:id", AttendanceController.updateAttendance);

// Delete an attendance by ID
router.delete("/attendance/:id", AttendanceController.deleteAttendance);



//approve attendace

router.post("/attendance/performAction/:attendanceId", AttendanceController.performActionOnAttendance);



export default router;

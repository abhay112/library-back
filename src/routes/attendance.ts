import express from "express";
import {
    newAttendance,
    attendanceApproved,
    getAllStudentTodayAttendance,
    getPresentStudent,
    getPendingAttendance,
} from "../controllers/attendance.js";
import { adminOnly } from "../middlewares/auth.js";


const app = express.Router();

// route - /api/v1/attendance/new
app.get('/getAllStudentTodayAttendace',adminOnly,getAllStudentTodayAttendance);
app.get('/getPresentStudent',adminOnly,getPresentStudent);
app.get('/getPendingAttendance',adminOnly,getPendingAttendance);

app.post("/attendanceApprove",adminOnly,attendanceApproved);


app.post("/:id",newAttendance);

export default app;

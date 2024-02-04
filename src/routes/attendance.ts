import express from "express";
import {
    newAttendance,
    attendanceApproved,
    getAllStudentTodayAttendance,
    getPresentStudent,
    getPendingAttendance,
    getStudentAllAttendance,
} from "../controllers/attendance.js";
import { adminOnly } from "../middlewares/auth.js";


const app = express.Router();

// route - /api/v1/attendance/new
app.get('/getAllStudentTodayAttendace',adminOnly,getAllStudentTodayAttendance);
app.get('/getPresentStudent',adminOnly,getPresentStudent);
app.get('/getPendingAttendance',adminOnly,getPendingAttendance);

app.get("/:id",getStudentAllAttendance);

// app.put("/attendanceApprove",adminOnly,attendanceApproved);
app.put("/attendanceApprove/:id", adminOnly, attendanceApproved);


app.post("/:id",adminOnly,newAttendance);

export default app;

import express from "express";

import { adminOnly } from "../middlewares/auth.js";
import { getCurrentMonthFees, getUserFees, submitDueFees } from "../controllers/fees.js";


const app = express.Router();

app.get('/getAllStudentLatestFees',adminOnly,getCurrentMonthFees);
app.get('/getPresentStudent',adminOnly,);
app.get('/getPendingAttendance',adminOnly,);


app.put("/attendanceApprove/:id", adminOnly, );

app.get("/:id",adminOnly,getUserFees);
app.put("/:id",submitDueFees);

// app.post("/:id",adminOnly,);

export default app;

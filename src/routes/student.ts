import express from "express";
import { adminOnly } from "../middlewares/auth.js";
import { deleteStudent, getAllStudents, getSingleStudent, getlatestStudents, newStudent, updateStudent } from "../controllers/student.js";
import { singleUpload } from "../middlewares/multer.js";

const app = express.Router();

//To Create New student  - /api/v1/student/new
app.post("/new", adminOnly, singleUpload, newStudent);

// To get all students with filters  - /api/v1/students/all  for 
app.get("/all", adminOnly,getAllStudents);

//To get all admin student  - /api/v1/student/latest
app.get("/latest",adminOnly, getlatestStudents);

app.route("/:id")
  .get(getSingleStudent)
  .put(adminOnly, singleUpload, updateStudent)
  .delete(adminOnly, deleteStudent);

export default app;

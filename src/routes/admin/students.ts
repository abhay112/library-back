import express from 'express';
import {StudentController} from '../../controllers/admin/admin.controller.js'; 

const router = express.Router();

// Create a new students
router.post("/students", StudentController.createStudent);

// Fetch the list of students
router.get("/students/all/:adminId", StudentController.fetchStudents);

// Fetch a single students by ID
router.get("/students/:id", StudentController.getStudentById);

// Update an students by ID
router.put("/students/:id", StudentController.updateStudent);

// routes/studentRoutes.ts
router.put("/students/:studentId/membership", StudentController.updateStudentMembership);

// Delete an students by ID
router.delete("/students/:id", StudentController.deleteStudent);

export default router;

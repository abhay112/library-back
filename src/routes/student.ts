import express from "express";
import { adminOnly } from "../middlewares/auth.js";
import { deleteStudent, getAllStudents, getSingleStudent, getlatestStudents, newStudent, updateStudent } from "../controllers/student.js";
import { singleUpload } from "../middlewares/multer.js";

const app = express.Router();

//To Create New Product  - /api/v1/student/new
app.post("/new", adminOnly, singleUpload, newStudent);

// To get all Products with filters  - /api/v1/students/all
app.get("/all", adminOnly,getAllStudents);

//To get last 10 Products  - /api/v1/product/latest
app.get("/latest",adminOnly, getlatestStudents);

// //To get all unique Categories  - /api/v1/product/categories
// app.get("/categories", getAllCategories);

// //To get all Products   - /api/v1/product/admin-products
// app.get("/admin-products", adminOnly, getAdminProducts);

// // To get, update, delete Product
app.route("/:id")
  .get(getSingleStudent)
  .put(adminOnly, singleUpload, updateStudent)
  .delete(adminOnly, deleteStudent);

export default app;

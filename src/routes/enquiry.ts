import express from "express";
import { adminOnly } from "../middlewares/auth.js";
import { deleteStudent, getAllStudents, getSingleStudent, getlatestStudents, newStudent, updateStudent } from "../controllers/student.js";
import { singleUpload } from "../middlewares/multer.js";
import { deleteEnquiry, getEnquiries,getSingleEnquiries, newEnquiry, updateEnquiry } from "../controllers/enquiry.js";

const app = express.Router();

app.get("/all", adminOnly,getEnquiries);
app.get("/:id", adminOnly,getSingleEnquiries);

app.post("/new", adminOnly, newEnquiry);
app.put("/:id", adminOnly, updateEnquiry); 

app.delete("/:id", adminOnly, deleteEnquiry); // Assuming you include the enquiryId in the route path

export default app;

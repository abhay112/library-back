import express from "express";
import {
  // deleteUser,
  getAdmin,
  adminSignIn,
  adminSignUp,
} from "../controllers/admin.js";
import { adminOnly } from "../middlewares/auth.js";
import { pdfDownload, pdfGeneration } from "../controllers/pdfGeneration.js";

const app = express.Router();


// route - /api/v1/user/new
app.post("/new", adminSignUp);

//a
app.post('/login',adminSignIn);
app.post('/recipts',pdfGeneration);


app.get('/download/:fileName',pdfDownload);
// Route - /api/v1/user/dynamicID

app.route("/:id").get(getAdmin);

export default app;

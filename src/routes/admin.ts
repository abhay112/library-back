import express from "express";
import {
  // deleteUser,
  getAdmin,
  adminSignIn,
  adminSignUp,
} from "../controllers/admin.js";

const app = express.Router();

// route - /api/v1/user/new
app.post("/new", adminSignUp);

//a
app.post('/login',adminSignIn);

// // Route - /api/v1/user/all
// app.get("/all", getAllUsers);

// Route - /api/v1/user/dynamicID
app.route("/:id").get(getAdmin);

export default app;

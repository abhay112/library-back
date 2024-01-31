import express from "express";
import {
    newQuery,
} from "../controllers/contact.js";

const app = express.Router();

// route - /api/v1/user/new
app.post("/new", newQuery);

export default app;

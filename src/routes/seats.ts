import express from "express";
import { adminOnly } from "../middlewares/auth.js";
import { createSeats, fetchSeatLayout, fetchFilledSeats } from "../controllers/seats.js";

const app = express.Router();



//To Create New seats  - /api/v1/seats/createSeat
app.post("/createSeats", adminOnly, createSeats);
app.get('/fetchSeatLayout/:id',fetchSeatLayout)
app.get("/fetchFilledSeats/:id", fetchFilledSeats);


export default app;

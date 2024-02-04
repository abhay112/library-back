import express from "express";
import { adminOnly } from "../middlewares/auth.js";
import { createSeats, fetchSeats } from "../controllers/seats.js";

const app = express.Router();

app.get("/fetchSeats",adminOnly, fetchSeats);

//To Create New seats  - /api/v1/seats/createSeat
app.post("/createSeats", adminOnly, createSeats);

//To Create New Product  - /api/v1/seats/createSeat

export default app;

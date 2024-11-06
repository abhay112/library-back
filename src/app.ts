import express from "express";
import NodeCache from "node-cache";
import { config } from "dotenv";
import morgan from "morgan";
import Stripe from "stripe";
import cors from "cors";
import mongoose, { Document } from "mongoose";
import { errorMiddleware } from "./middlewares/error.js";

// Importing Routes
import adminRoutes from './routes/admin/admin-users.js'
import libraryRoutes from './routes/admin/library.js'
import studentsRoutes from './routes/admin/students.js'
import attendanceRoutes from './routes/admin/attendance.js'
import seatsRoutes from './routes/admin/seats.js'



import adminRoute from "./routes/admin.js";
import userRoute from "./routes/client/user.js";
import studentRoute from "./routes/student.js";
import contactRoute from "./routes/contact.js";
import attendanceRoute from './routes/attendance.js'
import seatsRoute from "./routes/seats.js";
import feesRoute from "./routes/fees.js";
import enquiryRoute from "./routes/enquiry.js";
import swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from './swagger.json';

import bodyParser from 'body-parser';
import { connect } from "./utils/features.js";

config({path: "./.env"});

const port = process.env.PORT || 4000;
const mongoURI = process.env.MONGO_URI || "";
const stripeKey = process.env.STRIPE_KEY || "";

mongoose.set('strictQuery', false);

connect();

export const stripe = new Stripe(stripeKey);
export const myCache = new NodeCache();

const app = express();
app.use(bodyParser.json()); // For parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded


app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

app.get("/", (req, res) => {
  res.send("API Working with /api/v1");
});



app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Using Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/student", studentRoute);
app.use("/api/v1/contact", contactRoute);
// app.use("/api/v1/attendance", attendanceRoute);
// app.use("/api/v1/seats", seatsRoute);
app.use("/api/v1/enquiry", enquiryRoute);
app.use("/api/v1/fees", feesRoute);


app.use('/api/v1',adminRoutes)
app.use('/api/v1',libraryRoutes)
app.use('/api/v1',studentsRoutes)
app.use('/api/v1',attendanceRoutes)
app.use('/api/v1',seatsRoutes)








app.use("/uploads", express.static("uploads"));
app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Express is working on http://localhost:${port}`);
  console.log(`Swagger is Running on  http://localhost:${port}/api-docs`);
});

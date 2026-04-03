import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";
import { connectDb } from "./lib/db.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import fileUpload from "express-fileupload";

const app = express();

app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  api_key: process.env.CLOUDINARY_API_KEY,
});

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
    limits: { fileSize: 10 * 1024 * 1024 },
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/api", (req, res) => {
  res.json({
    success: true,
    message: "welcome to AI Powerd Hospital System backend api",
  });
});

import userRouter from "./routes/patient.route.js";
import otpRouter from "./routes/otp.route.js";
import doctorRouter from "./routes/doctor.route.js";
import adminRouter from "./routes/admin.route.js";
import appointmentRouter from "./routes/appointment.route.js";
import reviewRouter from "./routes/review.route.js";
import prescriptionRouter from "./routes/prescription.route.js";
import notificationRouter from "./routes/notification.route.js";
import medicineRouter from "./routes/medicine.route.js";
import { startMedicineScheduler } from "./controllers/prescription.controller.js";

app.use("/api/patient", userRouter);
app.use("/api/otp", otpRouter);
app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/review", reviewRouter);
app.use("/api/appointment", appointmentRouter);
app.use("/api/prescription", prescriptionRouter);
app.use("/api/notification", notificationRouter);
app.use("/api/medicine", medicineRouter);

app.use(errorMiddleware);

const startServer = async () => {
    await connectDb();
    await startMedicineScheduler();
    const PORT = process.env.PORT || 1111;
    app.listen(PORT, () => console.log(`server is live on ${PORT}`));
};

startServer();
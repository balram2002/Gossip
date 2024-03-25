import path from "path";
import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connectDB.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import { v2 as cloudinary } from "cloudinary";
import job from "./cron/cron.js";
import cors from "cors";

dotenv.config();

const app = express();

connectDB();
job.start();

const PORT = process.env.PORT || 5000;

app.use(cors({
	origin: ["https://gossip-api.vercel.app", "https://gossips-bd.vercel.app"],
	methods: ["POST", "GET", "PUT", "DELETE"],
	credentials: true
}));

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Middlewares
app.use(express.json({ limit: "80mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);


app.listen(PORT, () => console.log(`Server started at http://localhost:${PORT}`));

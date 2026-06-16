import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { authHandler } from "./routes/auth.js";
import authRoutes from "./routes/login.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS with support for credentials/cookies
app.use(cors({
    origin: true, // or specific frontend URLs, e.g., 'http://localhost:5173'
    credentials: true
}));

app.use(cookieParser());

// 1. Mount Better Auth Node handler BEFORE express.json() body parsing middleware
// Better Auth handles the raw stream requests itself.
app.all("/api/auth/*", authHandler);

// 2. Mount body parsers for general API routes AFTER Better Auth
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Custom application authentication routes (controller-based)
app.use("/api/custom-auth", authRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
    res.json({ status: "healthy", timestamp: new Date() });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
    console.log(`Better Auth available at http://localhost:${PORT}/api/auth`);
});

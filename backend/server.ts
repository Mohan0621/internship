import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import { authHandler } from "./routes/auth.js";
import authRoutes from "./routes/login.js";
import studentroutes from "./routes/studentRoutes.js";
import judgerouter from "./routes/judgeRoutes.js";
import teamroutes from "./routes/teamroutes.js";
import { swaggerSpec } from "./swagger.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors({
    origin: true,
    credentials: true
}));

app.use(cookieParser());

app.all("/api/auth/*", authHandler);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/custom-auth", authRoutes);
app.use("/api/student", studentroutes);
app.use("/api/judge", judgerouter);
app.use("/api/team", teamroutes);

// ── Swagger UI ────────────────────────────────────────────────────────────────
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// Raw OpenAPI JSON (useful for importing into Postman / Insomnia)
app.get("/api/docs.json", (_req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
});

app.get("/api/health", (req, res) => {
    res.json({ status: "healthy", timestamp: new Date() });
});
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
    console.log(`Better Auth available at http://localhost:${PORT}/api/auth`);
    console.log(`Swagger UI available at http://localhost:${PORT}/api/docs`);
    console.log(`OpenAPI JSON at http://localhost:${PORT}/api/docs.json`);
});

import express from "express";
import studentroutes from "../../routes/studentRoutes.js";
import teamroutes from "../../routes/teamroutes.js";
import judgerouter from "../../routes/judgeRoutes.js";

/**
 * Creates a minimal Express app that wires up all routes.
 * No real server is started — supertest drives it over an in-process socket.
 */
export function createApp() {
    const app = express();
    app.use(express.json());
    app.use("/api/student", studentroutes);
    app.use("/api/team", teamroutes);
    app.use("/api/judge", judgerouter);
    return app;
}

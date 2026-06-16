import express from "express";
import AuthController from "../controllers/authcontroller.js";

const auth_app = express.Router();
const controller = new AuthController();

auth_app.post("/login", (req, res) => {
    controller.login(req, res);
});

auth_app.post("/register", (req, res) => {
    controller.registration(req, res);
});

auth_app.get("/refresh", (req, res) => {
    controller.refresh(req, res);
});

export default auth_app;

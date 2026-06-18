import express from "express"
import JudgeController from "../controllers/judgecontroller.ts"
import JudgeService from "../services/judgeservices.ts"
import { requireRole } from "../middlewares/auth.ts"
const judgerouter = express.Router()
const judgeService = new JudgeService()
const judgeController = new JudgeController(judgeService)

judgerouter.post("/", requireRole("JUDGE"), judgeController.createJudge)
judgerouter.get("/", requireRole("JUDGE"), judgeController.getJudgeProfile)
judgerouter.put("/", requireRole("JUDGE"), judgeController.updateJudge)

export default judgerouter
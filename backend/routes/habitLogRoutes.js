import express from "express";
import { checkHabit, getHabitLogs, uncheckHabit } from "../controllers/habitLogControllers.js";

const router = express.Router();

router.post("/", checkHabit);
router.delete("/", uncheckHabit);
router.get("/", getHabitLogs);

export default router;
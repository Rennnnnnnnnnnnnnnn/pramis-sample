import express, { Router } from "express";
import { createHabit, deleteHabit, getHabits, reorderHabits, updateHabit } from "../controllers/habitControllers.js";

const router = express.Router();

router.put("/reorder", reorderHabits);
router.post("/", createHabit);
router.get("/", getHabits);
router.put("/:id", updateHabit);
router.delete("/:id", deleteHabit);



export default router;
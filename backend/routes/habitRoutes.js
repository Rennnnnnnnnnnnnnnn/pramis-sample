import express from "express";
import { createHabit, deleteHabit, getHabits, updateHabit } from "../controllers/habitControllers.js";

const router = express.Router();

router.post("/", createHabit);
router.get("/", getHabits);
router.put("/:id", updateHabit);
router.delete("/:id", deleteHabit);



export default router;
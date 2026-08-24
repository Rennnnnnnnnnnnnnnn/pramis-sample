import express, { Router } from "express";
import { createTask, deleteCompletedTasks, deleteTask, editTask, getTasks, toggleTask } from "../controllers/taskControllers.js";

const router = express.Router();

router.post("/", createTask);
router.get("/", getTasks);
router.delete("/deleteCompleted", deleteCompletedTasks);
router.delete("/:task_id", deleteTask);
router.put("/toggle/:task_id", toggleTask);
router.put("/:task_id", editTask);

export default router;
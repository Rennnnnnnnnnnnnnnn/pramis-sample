import express, { Router } from "express";
import { deleteAccount, getCurrentUser, updateEmail, updatePassword, updateUsername } from "../controllers/accountController.js";

const router = express.Router();

router.put("/updateUsername", updateUsername);
router.get("/me", getCurrentUser);
router.put("/updateEmail", updateEmail);
router.put("/updatePassword", updatePassword);
router.delete("/deleteAccount", deleteAccount);

export default router;
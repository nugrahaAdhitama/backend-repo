import express from "express";
import {
  registerUser,
  loginUser,
  createUser,
  fetchUser,
  updateUser,
  fetchUserById,
} from "../controller/api";
import authMiddleware from "../middleware/authMiddleware";

const router = express.Router();

router.post("/register-user", registerUser);
router.post("/login-user", loginUser);
router.post("/create-user-data", authMiddleware, createUser);
router.get("/fetch-user-data", authMiddleware, fetchUser);
router.put("/update-user-data", authMiddleware, updateUser);
router.get("/fetch-user-data/:id", fetchUserById);

export default router;

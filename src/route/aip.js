import express from "express";
import upload from "../config/multer";
import {
  handleLogin,
  handleGetAllUser,
  handleDeleteUser,
  handleCreateUser,
  handleEditUser,
  handleGetAllCode,
} from "../controllers/userController";
import { handleGetTopDoctor } from "../controllers/doctorController";

const router = express.Router();
router.post("/api/v1/login", handleLogin);
router.post("/api/v1/create-user", upload.single("image"), handleCreateUser);
router.get("/api/v1/get-All-User", handleGetAllUser);
router.delete("/api/v1/delete-user", handleDeleteUser);
router.put("/api/v1/edit-user", upload.single("image"), handleEditUser);
// doctor
router.get("/api/v1/get-topDoctor", handleGetTopDoctor);

router.get("/api/v1/get-allCode", handleGetAllCode);
// module.exports = router;
export default router;

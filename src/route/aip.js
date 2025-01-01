import express from "express";
import {
  handleLogin,
  handleGetAllUser,
  handleDeleteUser,
  handleCreateUser,
  handleEditUser,
} from "../controllers/userController";

const router = express.Router();

router.post("/api/v1/login", handleLogin);
router.post("/api/v1/create-user", handleCreateUser);
router.get("/api/v1/get-All-User", handleGetAllUser);
router.delete("/api/v1/delete-user", handleDeleteUser);
router.put("/api/v1/edit-user", handleEditUser);

// module.exports = router;
export default router;

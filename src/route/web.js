import express from "express";
import {
  getHomepage,
  getCRUD,
  postCreateUser,
  getReadUser,
  getUserById,
  postEditUser,
  postDeleteUser,
} from "../controllers/homeController";
const router = express.Router();

// router web
router.get("/", getHomepage);
router.get("/crud", getCRUD);

router.post("/create-user", postCreateUser);
router.get("/read-user", getReadUser);
router.get("/edit-user/:id", getUserById);
router.post("/edit-crud", postEditUser);
router.get("/delete-user/:id", postDeleteUser);

module.exports = router;

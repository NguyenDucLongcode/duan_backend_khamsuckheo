import express from "express";
import { getHomepage } from "../controllers/homeController";
const router = express.Router();

// router web
router.get("/", getHomepage);

module.exports = router;

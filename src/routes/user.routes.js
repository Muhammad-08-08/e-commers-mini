import express from "express";
import { makeAdmin } from "../controllers/user.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { adminOnly } from "../middlewares/admin.middleware.js";

const router = express.Router();

// ❗ faqat admin boshqa userni admin qila oladi
router.put("/:id/make-admin", protect, adminOnly, makeAdmin);

export default router;

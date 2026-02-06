import express from "express";
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { adminOnly } from "../middlewares/admin.middleware.js";

const router = express.Router();

router.route("/").get(getProducts);

// ❗ FAQAT ADMIN PRODUCT QO‘SHA OLADI
router.post("/", protect, adminOnly, createProduct);

router
  .route("/:id")
  .get(getProduct)
  .put(protect, adminOnly, updateProduct)
  .delete(protect, adminOnly, deleteProduct);

export default router;

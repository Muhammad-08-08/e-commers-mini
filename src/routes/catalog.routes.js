import express from "express";
import {
  getCatalogs,
  getByTypeSeason,
  createCatalog,
  updateCatalog,
  deleteCatalog,
  getCatalogById,
  getNestedCatalogs,
} from "../controllers/catalog.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { adminOnly } from "../middlewares/admin.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Catalog
 *   description: Product catalogs
 */

// 🔹 Barcha foydalanuvchi ko‘rishi mumkin
router.get("/", getCatalogs);
router.get("/filter", getByTypeSeason);
router.get("/nested", getNestedCatalogs);
router.get("/:id", getCatalogById);

// 🔹 Faqat admin CRUD
router.post("/", protect, adminOnly, createCatalog);
router.put("/:id", protect, adminOnly, updateCatalog);
router.delete("/:id", protect, adminOnly, deleteCatalog);

export default router;

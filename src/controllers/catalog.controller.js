import Catalog from "../models/Catalog.js";
import Product from "../models/Product.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     Catalog:
 *       type: object
 *       required:
 *         - type
 *         - season
 *       properties:
 *         type:
 *           type: string
 *           enum: [bertci, trenking, sapogi]
 *           example: "bertci"
 *         season:
 *           type: string
 *           enum: [yozgi, kuzgi]
 *           example: "yozgi"
 */

/**
 * @swagger
 * /api/catalogs:
 *   get:
 *     summary: Barcha kataloglarni olish
 *     tags: [Catalog]
 *     responses:
 *       200:
 *         description: Kataloglar ro'yxati
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Catalog'
 */
export const getCatalogs = async (req, res) => {
  try {
    const catalogs = await Catalog.find().populate("products");
    res.json(catalogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @swagger
 * /api/catalogs/{id}:
 *   get:
 *     summary: Bitta katalogni productlari bilan olish
 *     tags: [Catalog]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Katalog ID-si
 *     responses:
 *       200:
 *         description: Katalog topildi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Catalog'
 *       404:
 *         description: Katalog topilmadi
 */
export const getCatalogById = async (req, res) => {
  try {
    const catalog = await Catalog.findById(req.params.id).populate("products");

    if (!catalog) return res.status(404).json({ message: "Catalog not found" });

    res.json(catalog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @swagger
 * /api/catalogs/filter:
 *   get:
 *     summary: Type va Season bo‘yicha filter
 *     tags: [Catalog]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [bertci, trenking, sapogi]
 *       - in: query
 *         name: season
 *         schema:
 *           type: string
 *           enum: [yozgi, kuzgi]
 *     responses:
 *       200:
 *         description: Filterlangan kataloglar
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Catalog'
 */
export const getByTypeSeason = async (req, res) => {
  try {
    const { type, season } = req.query;

    const catalogs = await Catalog.find({
      ...(type && { type }),
      ...(season && { season }),
    }).populate("products");

    res.json(catalogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @swagger
 * /api/catalogs:
 *   post:
 *     summary: Yangi katalog yaratish (Admin)
 *     tags: [Catalog]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - season
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [bertci, trenking, sapogi]
 *                 example: "bertci"
 *               season:
 *                 type: string
 *                 enum: [yozgi, kuzgi]
 *                 example: "yozgi"
 *     responses:
 *       201:
 *         description: Katalog yaratildi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Catalog'
 */

export const createCatalog = async (req, res) => {
  try {
    const { type, season } = req.body;

    if (!type || !season) {
      return res.status(400).json({ message: "Type va season kerak" });
    }

    // title avtomatik yaratiladi
    const title = `${type} ${season} katalog`;

    const catalog = await Catalog.create({
      type,
      season,
      title,
      createdBy: req.user.id,
    });

    res.status(201).json(catalog);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * @swagger
 * /api/catalogs/{id}:
 *   put:
 *     summary: Katalogni tahrirlash
 *     tags: [Catalog]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Katalog ID-si
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Catalog'
 *     responses:
 *       200:
 *         description: Katalog yangilandi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Catalog'
 *       404:
 *         description: Katalog topilmadi
 */
export const updateCatalog = async (req, res) => {
  try {
    const catalog = await Catalog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).populate("products");

    if (!catalog) return res.status(404).json({ message: "Catalog not found" });

    res.json(catalog);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * @swagger
 * /api/catalogs/{id}:
 *   delete:
 *     summary: Katalogni o‘chirish
 *     tags: [Catalog]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Katalog ID-si
 *     responses:
 *       200:
 *         description: Katalog o'chirildi
 *       404:
 *         description: Katalog topilmadi
 */
export const deleteCatalog = async (req, res) => {
  try {
    const catalog = await Catalog.findByIdAndDelete(req.params.id);

    if (!catalog) return res.status(404).json({ message: "Catalog not found" });

    res.json({ message: "Catalog deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @swagger
 * /api/catalogs/nested:
 *   get:
 *     summary: Katalogni type va season bo‘yicha nested formatda olish
 *     tags: [Catalog]
 *     responses:
 *       200:
 *         description: Nested kataloglar
 */
export const getNestedCatalogs = async (req, res) => {
  try {
    const catalogs = await Catalog.find().populate("products");

    const nested = {};

    catalogs.forEach((cat) => {
      if (!nested[cat.type]) nested[cat.type] = {};
      if (!nested[cat.type][cat.season]) nested[cat.type][cat.season] = [];
      nested[cat.type][cat.season].push(...cat.products);
    });

    res.json(nested);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

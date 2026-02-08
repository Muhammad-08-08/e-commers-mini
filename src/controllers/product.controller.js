import Product from "../models/Product.js";
import Catalog from "../models/Catalog.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - catalog
 *       properties:
 *         name:
 *           type: string
 *           example: "Nike Air Max 270"
 *         description:
 *           type: string
 *           example: "Juda qulay sport poyabzali"
 *         image:
 *           type: string
 *           example: "https://link-to-image.com/nike.jpg"
 *         sizes:
 *           type: array
 *           items:
 *             type: number
 *           example: [40,41,42,43]
 *         catalog:
 *           type: string
 *           example: "64f1b2c9a12c9b0012345678"
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Barcha mahsulotlarni olish
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Mahsulotlar ro'yxati muvaffaqiyatli olindi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
export const getProducts = async (_, res) => {
  try {
    const products = await Product.find().populate("catalog");
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Bitta mahsulotni ID orqali olish
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Mahsulotning MongoDB ID-si
 *     responses:
 *       200:
 *         description: Mahsulot topildi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Mahsulot topilmadi
 */
export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("catalog");
    if (!product) return res.status(404).json({ message: "Not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Yangi mahsulot yaratish (Faqat Admin)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - type
 *               - season
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Nike Air Max 270"
 *               description:
 *                 type: string
 *                 example: "Juda qulay sport poyabzali"
 *               image:
 *                 type: string
 *                 example: "https://link-to-image.com/nike.jpg"
 *               sizes:
 *                 type: array
 *                 items:
 *                   type: number
 *                 example: [40,41,42,43]
 *               type:
 *                 type: string
 *                 example: "bertci"
 *               season:
 *                 type: string
 *                 example: "yozgi"
 *     responses:
 *       201:
 *         description: Mahsulot yaratildi
 */

export const createProduct = async (req, res) => {
  try {
    const { type, season, ...rest } = req.body;

    // catalogni type + season bo‘yicha topamiz
    const catalog = await Catalog.findOne({ type, season });
    if (!catalog)
      return res
        .status(400)
        .json({ message: "Bunday type va season uchun catalog mavjud emas" });

    const product = await Product.create({
      ...rest,
      catalog: catalog._id,
      createdBy: req.user.id,
    });

    // catalog.products ga faqat ObjectId qo‘shamiz
    catalog.products.push(product._id);
    await catalog.save();

    const populatedProduct = await Product.findById(product._id).populate(
      "catalog",
    );

    res.status(201).json(populatedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Mahsulot ma'lumotlarini tahrirlash
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Mahsulot ID-si
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Mahsulot yangilandi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Mahsulot topilmadi
 */
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!product) return res.status(404).json({ message: "Not found" });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Mahsulotni o'chirish
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Mahsulot ID-si
 *     responses:
 *       200:
 *         description: Mahsulot o'chirildi
 *       404:
 *         description: Mahsulot topilmadi
 */
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Not found" });

    // catalog ichidan ham o‘chiramiz
    await Catalog.findByIdAndUpdate(product.catalog, {
      $pull: { products: product._id },
    });

    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

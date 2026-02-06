import Product from "../models/Product.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
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
    const products = await Product.find();
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
 *       404:
 *         description: Mahsulot topilmadi
 */
export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
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
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Mahsulot yaratildi
 *       400:
 *         description: Noto'g'ri ma'lumot yuborildi
 *       401:
 *         description: Token xato yoki mavjud emas
 */
export const createProduct = async (req, res) => {
  try {
    const product = await Product.create({
      ...req.body,
      createdBy: req.user.id,
    });
    res.status(201).json(product);
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Mahsulot yangilandi
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
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

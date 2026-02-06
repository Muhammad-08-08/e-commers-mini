import bcrypt from "bcrypt";
import User from "../models/User.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     UserRegister:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           example: "Ali Valiyev"
 *         email:
 *           type: string
 *           example: "ali@gmail.com"
 *         password:
 *           type: string
 *           format: password
 *           example: "secret123"
 *     UserLogin:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           example: "ali@gmail.com"
 *         password:
 *           type: string
 *           format: password
 *           example: "secret123"
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Yangi foydalanuvchini ro'yxatdan o'tkazish
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRegister'
 *     responses:
 *       201:
 *         description: Muvaffaqiyatli ro'yxatdan o'tdi
 *       400:
 *         description: Email allaqachon mavjud
 */
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  // ❌ email mavjudligini tekshir
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: "Email exists" });

  // 🔒 parolni hash qil
  const hashed = await bcrypt.hash(password, 10);

  // 🏆 First admin logikasi:
  // Agar admin yo'q bo'lsa, birinchi user admin bo'ladi
  const adminExists = await User.findOne({ role: "admin" });
  const role = adminExists ? "user" : "admin";

  // user yarat
  const user = await User.create({ name, email, password: hashed, role });

  res.status(201).json({
    message: role === "admin" ? "First admin registered" : "Registered",
    user: { id: user._id, email: user.email, role: user.role },
  });
};

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Tizimga kirish va token olish
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserLogin'
 *     responses:
 *       200:
 *         description: Muvaffaqiyatli kirdi, Access Token qaytarildi
 *       401:
 *         description: Login yoki parol xato
 */
export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(401).json({ message: "Invalid credentials" });

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  res
    .cookie("refreshToken", refreshToken, { httpOnly: true, secure: true })
    .json({ accessToken });
};

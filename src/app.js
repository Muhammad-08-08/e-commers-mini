import express from "express";
import cors from "cors";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import userRoutes from "./routes/user.routes.js";

const app = express();

/* =======================
   CORS CONFIG
======================= */
const allowedOrigins = [
  "https://e-commers-mini-1.onrender.com/api/docs",
  "http://localhost:5000",
  process.env.BASE_URL, // https://e-commers.onrender.com
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Swagger / Postman / server-to-server so‘rovlar uchun
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS blocked"));
      }
    },
    credentials: true,
  })
);

/* =======================
   MIDDLEWARES
======================= */
app.use(express.json());
app.use(helmet());

/* =======================
   SWAGGER
======================= */
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/* =======================
   ROUTES
======================= */
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

export default app;

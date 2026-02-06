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
   CORS CONFIG (FIXED)
======================= */
const allowedOrigins = [
  "http://localhost:5000",
  "http://localhost:3000",
  "https://e-commers-mini-1.onrender.com",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Swagger, Postman, server-to-server
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("CORS blocked: " + origin));
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

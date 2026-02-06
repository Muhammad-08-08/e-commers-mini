import express from "express";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";

import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import userRoutes from "./routes/user.routes.js";

const app = express();

/* =======================
   MIDDLEWARES
======================= */
app.use(express.json());
app.use(helmet());

/* =======================
   SWAGGER
======================= */
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// trailing slash bo‘lsa ham ishlashi uchun (ixtiyoriy, lekin foydali)
app.get("/api/docs/", (req, res) => {
  res.redirect("/api/docs");
});

/* =======================
   ROUTES
======================= */
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

export default app;

import mongoose from "mongoose";

const catalogSchema = new mongoose.Schema(
  {
    title: { type: String }, // shart emas
    type: {
      type: String,
      enum: ["bertci", "trenking", "sapogi"],
      required: true,
    },
    season: {
      type: String,
      enum: ["yozgi", "kuzgi"],
      required: true,
    },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

export default mongoose.model("Catalog", catalogSchema);

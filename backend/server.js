const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const app = express();

// middlewares
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

// DB
connectDB();

// routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/suppliers", require("./routes/supplierRoutes"));
app.use("/api/payments", require("./routes/paymentRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));
app.use("/api/delivery", require("./routes/deliveryRoute"));
app.use("/api/upload", require("./routes/uploadRoutes"));

app.listen(process.env.PORT, () => {
  console.log("Server running 🚀");
});
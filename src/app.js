const express = require("express");

const authRoutes = require("./routes/authRoutes");
const customerRoutes = require("./routes/customerRoutes");
const deviceRoutes = require("./routes/deviceRoutes");
const ticketRoutes = require("./routes/ticketRoutes");
const authMiddleware = require("./middlewares/authMiddleware");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Smart CRM Mekong Mobile API is running."
  });
});

// API dang nhap, dang xuat, kiem tra phien
app.use("/api/auth", authRoutes);

// Cac API nghiep vu yeu cau dang nhap
app.use("/api/customers", authMiddleware, customerRoutes);
app.use("/api/devices", authMiddleware, deviceRoutes);
app.use("/api/tickets", authMiddleware, ticketRoutes);

// Xu ly loi
app.use((err, req, res, next) => {
  console.error(err.message);

  const status = err.status || (
    err.code === "SQLITE_CONSTRAINT_UNIQUE" ? 409 : 500
  );

  res.status(status).json({
    success: false,
    message: status === 500 ? "Loi may chu." : err.message
  });
});

// API khong ton tai
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Khong tim thay API."
  });
});

app.listen(PORT, () => {
  console.log(`Smart CRM API dang chay tai http://localhost:${PORT}`);
});
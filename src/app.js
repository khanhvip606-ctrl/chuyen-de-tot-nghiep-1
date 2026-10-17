
const express = require("express");
const customerRoutes = require("./routes/customerRoutes");
const deviceRoutes = require("./routes/deviceRoutes");
const ticketRoutes = require("./routes/ticketRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Doc du lieu JSON tu request body
app.use(express.json());

// Kiem tra server
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Smart CRM Mekong Mobile API is running."
  });
});

// API khach hang
app.use("/api/customers", customerRoutes);

// API thiet bi
app.use("/api/devices", deviceRoutes);

// API yeu cau bao hanh
app.use("/api/tickets", ticketRoutes);

// Xu ly loi tap trung
app.use((err, req, res, next) => {
  console.error(err.message);

  const status = err.status || (
    err.code === "SQLITE_CONSTRAINT_UNIQUE" ? 409 : 500
  );

  res.status(status).json({
    success: false,
    message: status === 500
      ? "Loi may chu."
      : err.message
  });
});

// Xu ly endpoint khong ton tai
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Khong tim thay API."
  });
});

// Khoi dong server
app.listen(PORT, () => {
  console.log(`Smart CRM API dang chay tai http://localhost:${PORT}`);
});

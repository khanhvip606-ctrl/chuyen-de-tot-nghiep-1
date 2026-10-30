const express = require("express");
const authService = require("../services/authService");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

function getToken(req) {
  const authorization = req.headers.authorization || "";
  return authorization.startsWith("Bearer ")
    ? authorization.slice(7).trim()
    : "";
}

// Dang nhap
router.post("/login", (req, res, next) => {
  try {
    const { username, password } = req.body || {};
    const result = authService.login(username, password);

    res.json({
      success: true,
      message: "Dang nhap thanh cong.",
      data: result
    });
  } catch (error) {
    next(error);
  }
});

// Kiem tra phien dang nhap
router.get("/me", authMiddleware, (req, res) => {
  res.json({
    success: true,
    data: {
      user: req.user
    }
  });
});

// Dang xuat
router.post("/logout", authMiddleware, (req, res) => {
  authService.logout(getToken(req));

  res.json({
    success: true,
    message: "Dang xuat thanh cong."
  });
});

module.exports = router;
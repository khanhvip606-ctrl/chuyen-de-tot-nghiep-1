
const express = require("express");
const router = express.Router();

const customerService = require("../services/customerService");

// GET /api/customers - Danh sach khach hang
router.get("/", (req, res, next) => {
  try {
    const customers = customerService.getAllCustomers();
    res.json({
      success: true,
      data: customers
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/customers/:id - Chi tiet khach hang
router.get("/:id", (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "ID khach hang khong hop le."
      });
    }

    const customer = customerService.getCustomerById(id);

    res.json({
      success: true,
      data: customer
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/customers - Them khach hang
router.post("/", (req, res, next) => {
  try {
    const customer = customerService.createCustomer(req.body);

    res.status(201).json({
      success: true,
      message: "Them khach hang thanh cong.",
      data: customer
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/customers/:id - Cap nhat khach hang
router.put("/:id", (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "ID khach hang khong hop le."
      });
    }

    const customer = customerService.updateCustomer(id, req.body);

    res.json({
      success: true,
      message: "Cap nhat khach hang thanh cong.",
      data: customer
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

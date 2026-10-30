
const express = require("express");
const router = express.Router();

const deviceService = require("../services/deviceService");

// GET /api/devices - Danh sach thiet bi
router.get("/", (req, res, next) => {
  try {
    res.json({
      success: true,
      data: deviceService.getAllDevices()
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/devices/:id - Chi tiet thiet bi
router.get("/:id", (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "ID thiet bi khong hop le."
      });
    }

    res.json({
      success: true,
      data: deviceService.getDeviceById(id)
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/devices - Them thiet bi
router.post("/", (req, res, next) => {
  try {
    const device = deviceService.createDevice(req.body);

    res.status(201).json({
      success: true,
      message: "Them thiet bi thanh cong.",
      data: device
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/devices/:id - Cap nhat thiet bi
router.put("/:id", (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "ID thiet bi khong hop le."
      });
    }

    const device = deviceService.updateDevice(id, req.body);

    res.json({
      success: true,
      message: "Cap nhat thiet bi thanh cong.",
      data: device
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/devices/:id - Ngung hoat dong thiet bi
router.delete("/:id", (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "ID thiet bi khong hop le."
      });
    }

    const device = deviceService.deleteDevice(id);

    res.json({
      success: true,
      message: "Ngung hoat dong thiet bi thanh cong.",
      data: device
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

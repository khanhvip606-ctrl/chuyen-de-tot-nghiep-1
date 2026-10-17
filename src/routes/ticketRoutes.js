const express = require("express");
const router = express.Router();

const ticketService = require("../services/ticketService");

// GET /api/tickets - Danh sach yeu cau bao hanh
router.get("/", (req, res, next) => {
  try {
    res.json({
      success: true,
      data: ticketService.getAllTickets()
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/tickets/:id/history - Lich su trang thai
router.get("/:id/history", (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "ID yeu cau bao hanh khong hop le."
      });
    }

    const history = ticketService.getTicketStatusHistory(id);

    res.json({
      success: true,
      data: history
    });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/tickets/:id/status - Cap nhat trang thai
router.patch("/:id/status", (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "ID yeu cau bao hanh khong hop le."
      });
    }

    const result = ticketService.updateTicketStatus(id, req.body);

    res.json({
      success: true,
      message: result.changed
        ? "Cap nhat trang thai thanh cong."
        : "Trang thai khong thay doi.",
      data: result.ticket
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/tickets/:id - Chi tiet yeu cau bao hanh
router.get("/:id", (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "ID yeu cau bao hanh khong hop le."
      });
    }

    res.json({
      success: true,
      data: ticketService.getTicketById(id)
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/tickets - Tao yeu cau bao hanh
router.post("/", (req, res, next) => {
  try {
    const ticket = ticketService.createTicket(req.body);

    res.status(201).json({
      success: true,
      message: "Tiep nhan yeu cau bao hanh thanh cong.",
      data: ticket
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
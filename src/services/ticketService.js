const ticketRepository = require("../repositories/ticketRepository");
const customerRepository = require("../repositories/customerRepository");
const db = require("../database/db");

const VALID_PRIORITIES = ["CAO", "TRUNG_BINH", "THAP"];

const VALID_CATEGORIES = [
  "PHAN_CUNG",
  "PHAN_MEM",
  "BAO_HANH",
  "KHAC"
];

function calculateSla(priority, createdAt = new Date()) {
  const slaHours = {
    CAO: 24,
    TRUNG_BINH: 72,
    THAP: 120
  };

  const dueDate = new Date(createdAt);
  dueDate.setHours(dueDate.getHours() + slaHours[priority]);

  return dueDate.toISOString();
}

function validateTicket(data) {
  const errors = [];

  const customerId = Number(data.customer_id);
  const deviceId = Number(data.device_id);
  const category = String(data.issue_category || "").trim();
  const description = String(data.issue_description || "").trim();
  const priority = String(data.priority || "").trim().toUpperCase();

  if (!Number.isInteger(customerId) || customerId <= 0) {
    errors.push("customer_id khong hop le.");
  } else if (!customerRepository.getById(customerId)) {
    errors.push("Khong tim thay khach hang.");
  }

  if (!Number.isInteger(deviceId) || deviceId <= 0) {
    errors.push("device_id khong hop le.");
  }

  if (!VALID_CATEGORIES.includes(category)) {
    errors.push("Nhom loi khong hop le.");
  }

  if (!description) {
    errors.push("Mo ta loi khong duoc de trong.");
  }

  if (!VALID_PRIORITIES.includes(priority)) {
    errors.push("Muc do uu tien khong hop le.");
  }

  if (errors.length > 0) {
    const error = new Error(errors.join(" "));
    error.status = 400;
    throw error;
  }

  const device = db.prepare(`
    SELECT device_id, customer_id
    FROM device
    WHERE device_id = ?
  `).get(deviceId);

  if (!device) {
    const error = new Error("Khong tim thay thiet bi.");
    error.status = 404;
    throw error;
  }

  if (device.customer_id !== customerId) {
    const error = new Error("Thiet bi khong thuoc khach hang da chon.");
    error.status = 400;
    throw error;
  }

  return {
    customer_id: customerId,
    device_id: deviceId,
    technician_id: data.technician_id
      ? Number(data.technician_id)
      : null,
    issue_category: category,
    issue_description: description,
    priority
  };
}

function getAllTickets() {
  return ticketRepository.getAll();
}

function getTicketById(id) {
  const ticket = ticketRepository.getById(id);

  if (!ticket) {
    const error = new Error("Khong tim thay yeu cau bao hanh.");
    error.status = 404;
    throw error;
  }

  return ticket;
}

function createTicket(data) {
  const ticketData = validateTicket(data);

  const ticketCode =
    "TKT-" +
    new Date().toISOString().slice(0, 10).replace(/-/g, "") +
    "-" +
    Date.now().toString().slice(-6);

  const slaDueAt = calculateSla(ticketData.priority);

  return ticketRepository.create({
    ticket_code: ticketCode,
    ...ticketData,
    status: "MOI",
    sla_due_at: slaDueAt
  });
}

module.exports = {
  getAllTickets,
  getTicketById,
  createTicket
};
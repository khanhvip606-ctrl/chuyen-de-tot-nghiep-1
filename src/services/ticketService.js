
const ticketRepository = require("../repositories/ticketRepository");
const customerRepository = require("../repositories/customerRepository");
const deviceRepository = require("../repositories/deviceRepository");

const VALID_PRIORITIES = ["CAO", "TRUNG_BINH", "THAP"];

const VALID_CATEGORIES = [
  "PHAN_CUNG",
  "PHAN_MEM",
  "BAO_HANH",
  "KHAC"
];

const VALID_STATUSES = [
  "MOI",
  "DANG_XU_LY",
  "CHO_LINH_KIEN",
  "DA_HOAN_TAT",
  "DA_HUY"
];

function createError(message, status) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function validateId(id, label = "ID phieu bao hanh") {
  const parsedId = Number(id);

  if (!Number.isInteger(parsedId) || parsedId <= 0) {
    throw createError(`${label} khong hop le.`, 400);
  }

  return parsedId;
}

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

function validateTicket(data = {}) {
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
    throw createError(errors.join(" "), 400);
  }

  const device = deviceRepository.getById(deviceId);

  if (!device) {
    throw createError("Khong tim thay thiet bi.", 404);
  }

  if (Number(device.customer_id) !== customerId) {
    throw createError(
      "Thiet bi khong thuoc khach hang da chon.",
      400
    );
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
  const ticketId = validateId(id);
  const ticket = ticketRepository.getById(ticketId);

  if (!ticket) {
    throw createError("Khong tim thay yeu cau bao hanh.", 404);
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

function updateTicketStatus(id, data = {}) {
  const ticketId = validateId(id);

  // Kiem tra phieu ton tai
  const existingTicket = ticketRepository.getById(ticketId);

  if (!existingTicket) {
    throw createError("Khong tim thay yeu cau bao hanh.", 404);
  }

  // Kiem tra trang thai moi
  const newStatus = String(data.status || "").trim().toUpperCase();

  if (!VALID_STATUSES.includes(newStatus)) {
    throw createError("Trang thai phieu bao hanh khong hop le.", 400);
  }

  const note = data.note == null
    ? null
    : String(data.note).trim() || null;

  if (note && note.length > 500) {
    throw createError("Ghi chu khong duoc vuot qua 500 ky tu.", 400);
  }

  // Repository cap nhat trang thai va ghi lich su trong cung transaction
  const result = ticketRepository.updateStatus(
    ticketId,
    newStatus,
    note,
    "api"
  );

  return {
    ticket: ticketRepository.getById(ticketId),
    changed: result.changed
  };
}

function getTicketStatusHistory(id) {
  const ticketId = validateId(id);

  // Chi tra lich su neu phieu ton tai
  const ticket = ticketRepository.getById(ticketId);

  if (!ticket) {
    throw createError("Khong tim thay yeu cau bao hanh.", 404);
  }

  return ticketRepository.getStatusHistory(ticketId);
}

module.exports = {
  getAllTickets,
  getTicketById,
  createTicket,
  updateTicketStatus,
  getTicketStatusHistory
};

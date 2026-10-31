
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

// Tinh SLA theo lich lam viec Viet Nam (UTC+7).
// Thu Hai - Thu Bay: 08:00 - 17:00.
// Chu Nhat: nghi.
function calculateSla(priority, createdAt = new Date()) {
  const slaHours = {
    CAO: 24,
    TRUNG_BINH: 72,
    THAP: 120
  };

  const totalHours = slaHours[priority];

  if (!totalHours) {
    throw createError("Muc do uu tien khong hop le.", 400);
  }

  const OFFSET = 7 * 60 * 60 * 1000;
  const START_HOUR = 8;
  const END_HOUR = 17;

  const inputDate = new Date(createdAt);

  if (Number.isNaN(inputDate.getTime())) {
    throw createError("Thoi diem tao phieu khong hop le.", 400);
  }

  // Chuyen sang gio Viet Nam de tinh SLA.
  const date = new Date(inputDate.getTime() + OFFSET);

  let remainingMs = totalHours * 60 * 60 * 1000;

  function nextWorkday() {
    date.setUTCDate(date.getUTCDate() + 1);

    // Bo qua Chu Nhat.
    while (date.getUTCDay() === 0) {
      date.setUTCDate(date.getUTCDate() + 1);
    }

    date.setUTCHours(START_HOUR, 0, 0, 0);
  }

  // Neu la Chu Nhat, chuyen sang ngay lam viec tiep theo.
  while (date.getUTCDay() === 0) {
    nextWorkday();
  }

  // Neu truoc 08:00, bat dau tu 08:00.
  if (date.getUTCHours() < START_HOUR) {
    date.setUTCHours(START_HOUR, 0, 0, 0);
  } else if (date.getUTCHours() >= END_HOUR) {
    // Neu tu 17:00 tro di, chuyen sang ngay lam viec tiep theo.
    nextWorkday();
  }

  while (remainingMs > 0) {
    const endOfDay = new Date(date);
    endOfDay.setUTCHours(END_HOUR, 0, 0, 0);

    const availableMs = endOfDay.getTime() - date.getTime();

    if (remainingMs <= availableMs) {
      date.setTime(date.getTime() + remainingMs);
      remainingMs = 0;
    } else {
      remainingMs -= availableMs;
      nextWorkday();
    }
  }

  // Chuyen tu gio Viet Nam ve UTC de luu vao SQLite.
  return new Date(date.getTime() - OFFSET).toISOString();
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

  const existingTicket = ticketRepository.getById(ticketId);

  if (!existingTicket) {
    throw createError("Khong tim thay yeu cau bao hanh.", 404);
  }

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
  getTicketStatusHistory,
  calculateSla
};

const db = require("../database/db");

const findAll = db.prepare(`
  SELECT
    t.ticket_id,
    t.ticket_code,
    t.customer_id,
    c.customer_name,
    t.device_id,
    d.device_name,
    d.serial_number,
    t.technician_id,
    t.issue_category,
    t.issue_description,
    t.priority,
    t.status,
    t.created_at,
    t.sla_due_at
  FROM ticket t
  INNER JOIN customer c
    ON c.customer_id = t.customer_id
  INNER JOIN device d
    ON d.device_id = t.device_id
  ORDER BY t.ticket_id DESC
`);

const findById = db.prepare(`
  SELECT
    t.ticket_id,
    t.ticket_code,
    t.customer_id,
    c.customer_name,
    t.device_id,
    d.device_name,
    d.serial_number,
    t.technician_id,
    t.issue_category,
    t.issue_description,
    t.priority,
    t.status,
    t.created_at,
    t.sla_due_at
  FROM ticket t
  INNER JOIN customer c
    ON c.customer_id = t.customer_id
  INNER JOIN device d
    ON d.device_id = t.device_id
  WHERE t.ticket_id = ?
`);

const findByCode = db.prepare(`
  SELECT
    ticket_id,
    ticket_code,
    customer_id,
    device_id,
    technician_id,
    issue_category,
    issue_description,
    priority,
    status,
    created_at,
    sla_due_at
  FROM ticket
  WHERE ticket_code = ?
`);

const findStatusById = db.prepare(`
  SELECT ticket_id, status
  FROM ticket
  WHERE ticket_id = ?
`);

const insertTicket = db.prepare(`
  INSERT INTO ticket (
    ticket_code,
    customer_id,
    device_id,
    technician_id,
    issue_category,
    issue_description,
    priority,
    status,
    sla_due_at
  )
  VALUES (
    @ticket_code,
    @customer_id,
    @device_id,
    @technician_id,
    @issue_category,
    @issue_description,
    @priority,
    @status,
    @sla_due_at
  )
`);

const insertStatusLog = db.prepare(`
  INSERT INTO ticket_status_log (
    ticket_id,
    old_status,
    new_status,
    note,
    changed_by
  )
  VALUES (
    @ticket_id,
    @old_status,
    @new_status,
    @note,
    @changed_by
  )
`);

const updateTicketStatus = db.prepare(`
  UPDATE ticket
  SET status = ?
  WHERE ticket_id = ?
`);

const findHistory = db.prepare(`
  SELECT
    log_id,
    ticket_id,
    old_status,
    new_status,
    note,
    changed_at,
    changed_by
  FROM ticket_status_log
  WHERE ticket_id = ?
  ORDER BY changed_at DESC, log_id DESC
`);

// Tao phieu va ghi trang thai ban dau trong cung transaction
const createTicketTransaction = db.transaction((data) => {
  const result = insertTicket.run(data);
  const ticketId = Number(result.lastInsertRowid);

  insertStatusLog.run({
    ticket_id: ticketId,
    old_status: null,
    new_status: data.status || "MOI",
    note: "Tiep nhan yeu cau bao hanh",
    changed_by: "system"
  });

  return ticketId;
});

// Cap nhat trang thai va ghi lich su trong cung transaction
const updateStatusTransaction = db.transaction((data) => {
  const currentTicket = findStatusById.get(data.ticket_id);

  if (!currentTicket) {
    return null;
  }

  // Neu trang thai khong thay doi thi khong ghi log trung
  if (currentTicket.status === data.new_status) {
    return {
      ticket_id: data.ticket_id,
      changed: false
    };
  }

  updateTicketStatus.run(
    data.new_status,
    data.ticket_id
  );

  insertStatusLog.run({
    ticket_id: data.ticket_id,
    old_status: currentTicket.status,
    new_status: data.new_status,
    note: data.note || null,
    changed_by: data.changed_by || "system"
  });

  return {
    ticket_id: data.ticket_id,
    changed: true
  };
});

function getAll() {
  return findAll.all();
}

function getById(id) {
  return findById.get(id);
}

function getByCode(ticketCode) {
  return findByCode.get(ticketCode);
}

function create(data) {
  const ticketId = createTicketTransaction(data);
  return getById(ticketId);
}

function updateStatus(ticketId, newStatus, note, changedBy) {
  return updateStatusTransaction({
    ticket_id: Number(ticketId),
    new_status: newStatus,
    note,
    changed_by: changedBy
  });
}

function getStatusHistory(ticketId) {
  return findHistory.all(Number(ticketId));
}

module.exports = {
  getAll,
  getById,
  getByCode,
  create,
  updateStatus,
  getStatusHistory
};
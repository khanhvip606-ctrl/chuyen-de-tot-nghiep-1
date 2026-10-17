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
  const result = insertTicket.run(data);

  return getById(Number(result.lastInsertRowid));
}

module.exports = {
  getAll,
  getById,
  getByCode,
  create
};
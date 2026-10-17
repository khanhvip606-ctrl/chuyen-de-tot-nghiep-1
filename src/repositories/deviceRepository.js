const db = require("../database/db");

const findAll = db.prepare(`
  SELECT
    device_id,
    customer_id,
    serial_number,
    device_name,
    purchase_date,
    warranty_expiry
  FROM device
  ORDER BY device_id DESC
`);

const findById = db.prepare(`
  SELECT
    device_id,
    customer_id,
    serial_number,
    device_name,
    purchase_date,
    warranty_expiry
  FROM device
  WHERE device_id = ?
`);

const findBySerial = db.prepare(`
  SELECT
    device_id,
    customer_id,
    serial_number,
    device_name,
    purchase_date,
    warranty_expiry
  FROM device
  WHERE serial_number = ?
`);

const insertDevice = db.prepare(`
  INSERT INTO device (
    customer_id,
    serial_number,
    device_name,
    purchase_date,
    warranty_expiry
  )
  VALUES (
    @customer_id,
    @serial_number,
    @device_name,
    @purchase_date,
    @warranty_expiry
  )
`);

function getAll() {
  return findAll.all();
}

function getById(id) {
  return findById.get(id);
}

function getBySerial(serialNumber) {
  return findBySerial.get(serialNumber);
}

function create(data) {
  const result = insertDevice.run(data);

  return getById(Number(result.lastInsertRowid));
}

module.exports = {
  getAll,
  getById,
  getBySerial,
  create
};
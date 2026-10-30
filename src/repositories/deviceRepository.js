
const db = require("../database/db");

const findAll = db.prepare(`
  SELECT
    device_id,
    customer_id,
    serial_number,
    device_name,
    purchase_date,
    warranty_expiry,
    is_active
  FROM device
  WHERE is_active = 1
  ORDER BY device_id DESC
`);

const findById = db.prepare(`
  SELECT
    device_id,
    customer_id,
    serial_number,
    device_name,
    purchase_date,
    warranty_expiry,
    is_active
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
    warranty_expiry,
    is_active
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

const updateDevice = db.prepare(`
  UPDATE device
  SET customer_id = @customer_id,
      serial_number = @serial_number,
      device_name = @device_name,
      purchase_date = @purchase_date,
      warranty_expiry = @warranty_expiry
  WHERE device_id = @device_id
    AND is_active = 1
`);

const deactivateDevice = db.prepare(`
  UPDATE device
  SET is_active = 0
  WHERE device_id = ?
    AND is_active = 1
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

function update(id, data) {
  updateDevice.run({
    ...data,
    device_id: id
  });

  return getById(id);
}

function deactivate(id) {
  return deactivateDevice.run(id).changes > 0;
}

module.exports = {
  getAll,
  getById,
  getBySerial,
  create,
  update,
  deactivate
};

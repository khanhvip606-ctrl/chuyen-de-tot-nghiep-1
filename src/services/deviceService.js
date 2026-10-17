const deviceRepository = require("../repositories/deviceRepository");
const customerRepository = require("../repositories/customerRepository");

function validateDevice(data) {
  const errors = [];

  const customerId = Number(data.customer_id);
  const serialNumber = String(data.serial_number || "").trim();
  const deviceName = String(data.device_name || "").trim();

  if (!Number.isInteger(customerId) || customerId <= 0) {
    errors.push("Ma khach hang khong hop le.");
  } else if (!customerRepository.getById(customerId)) {
    errors.push("Khong tim thay khach hang.");
  }

  if (!serialNumber) {
    errors.push("Serial number khong duoc de trong.");
  }

  if (!deviceName) {
    errors.push("Ten thiet bi khong duoc de trong.");
  }

  if (errors.length > 0) {
    const error = new Error(errors.join(" "));
    error.status = 400;
    throw error;
  }

  return {
    customer_id: customerId,
    serial_number: serialNumber,
    device_name: deviceName,
    purchase_date: data.purchase_date || null,
    warranty_expiry: data.warranty_expiry || null
  };
}

function getAllDevices() {
  return deviceRepository.getAll();
}

function getDeviceById(id) {
  const device = deviceRepository.getById(id);

  if (!device) {
    const error = new Error("Khong tim thay thiet bi.");
    error.status = 404;
    throw error;
  }

  return device;
}

function createDevice(data) {
  const deviceData = validateDevice(data);

  if (deviceRepository.getBySerial(deviceData.serial_number)) {
    const error = new Error("Serial number da ton tai.");
    error.status = 409;
    throw error;
  }

  return deviceRepository.create(deviceData);
}

module.exports = {
  getAllDevices,
  getDeviceById,
  createDevice
};
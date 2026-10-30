
const deviceRepository = require("../repositories/deviceRepository");
const customerRepository = require("../repositories/customerRepository");

function createError(message, status) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function validateDevice(data) {
  const errors = [];

  const customerId = Number(data?.customer_id);
  const serialNumber = String(data?.serial_number || "").trim();
  const deviceName = String(data?.device_name || "").trim();

  if (!Number.isInteger(customerId) || customerId <= 0) {
    errors.push("Ma khach hang khong hop le.");
  } else {
    const customer = customerRepository.getById(customerId);

    if (!customer || customer.is_active !== 1) {
      errors.push("Khach hang khong ton tai hoac da ngung hoat dong.");
    }
  }

  if (!serialNumber) {
    errors.push("Serial number khong duoc de trong.");
  }

  if (!deviceName) {
    errors.push("Ten thiet bi khong duoc de trong.");
  }

  if (errors.length > 0) {
    throw createError(errors.join(" "), 400);
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

  if (!device || device.is_active !== 1) {
    throw createError("Khong tim thay thiet bi.", 404);
  }

  return device;
}

function createDevice(data) {
  const deviceData = validateDevice(data);
  const existing = deviceRepository.getBySerial(deviceData.serial_number);

  if (existing) {
    throw createError("Serial number da ton tai.", 409);
  }

  return deviceRepository.create(deviceData);
}

function updateDevice(id, data) {
  getDeviceById(id);

  const deviceData = validateDevice(data);
  const existing = deviceRepository.getBySerial(deviceData.serial_number);

  if (existing && existing.device_id !== Number(id)) {
    throw createError("Serial number da thuoc thiet bi khac.", 409);
  }

  return deviceRepository.update(Number(id), deviceData);
}

function deleteDevice(id) {
  getDeviceById(id);

  const deleted = deviceRepository.deactivate(Number(id));

  if (!deleted) {
    throw createError("Khong the ngung hoat dong thiet bi.", 400);
  }

  return {
    device_id: Number(id),
    is_active: 0
  };
}

module.exports = {
  getAllDevices,
  getDeviceById,
  createDevice,
  updateDevice,
  deleteDevice
};

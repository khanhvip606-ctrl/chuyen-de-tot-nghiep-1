
const customerRepository = require("../repositories/customerRepository");

function createError(message, status) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function validateCustomer(data) {
  const errors = [];

  if (!data || !data.customer_name || !String(data.customer_name).trim()) {
    errors.push("Ten khach hang khong duoc de trong.");
  }

  const phone = String(data?.phone || "").trim();

  if (!/^0\d{9}$/.test(phone)) {
    errors.push("So dien thoai phai co 10 chu so va bat dau bang 0.");
  }

  const email = data?.email ? String(data.email).trim() : "";

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push("Email khong dung dinh dang.");
  }

  if (errors.length > 0) {
    throw createError(errors.join(" "), 400);
  }

  return {
    customer_name: String(data.customer_name).trim(),
    phone,
    email: email || null,
    address: data.address ? String(data.address).trim() : null
  };
}

function getAllCustomers() {
  return customerRepository.getAll();
}

function getCustomerById(id) {
  const customer = customerRepository.getById(id);

  if (!customer || customer.is_active !== 1) {
    throw createError("Khong tim thay khach hang.", 404);
  }

  return customer;
}

function createCustomer(data) {
  const customerData = validateCustomer(data);
  const existing = customerRepository.getByPhone(customerData.phone);

  if (existing) {
    throw createError("So dien thoai da ton tai.", 409);
  }

  return customerRepository.create(customerData);
}

function updateCustomer(id, data) {
  getCustomerById(id);

  const customerData = validateCustomer(data);
  const duplicate = customerRepository.getByPhone(customerData.phone);

  if (duplicate && duplicate.customer_id !== Number(id)) {
    throw createError("So dien thoai da thuoc khach hang khac.", 409);
  }

  return customerRepository.update(Number(id), customerData);
}

function deleteCustomer(id) {
  getCustomerById(id);

  const deleted = customerRepository.deactivate(Number(id));

  if (!deleted) {
    throw createError("Khong the ngung hoat dong khach hang.", 400);
  }

  return {
    customer_id: Number(id),
    is_active: 0
  };
}

module.exports = {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer
};

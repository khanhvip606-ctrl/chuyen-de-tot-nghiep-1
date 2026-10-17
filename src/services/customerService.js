
const customerRepository = require("../repositories/customerRepository");

function validateCustomer(data) {
  const errors = [];

  if (!data.customer_name || !String(data.customer_name).trim()) {
    errors.push("Tên khách hàng không được để trống.");
  }

  const phone = String(data.phone || "").trim();

  if (!/^0\d{9}$/.test(phone)) {
    errors.push("Số điện thoại phải có 10 chữ số và bắt đầu bằng 0.");
  }

  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push("Email không đúng định dạng.");
  }

  if (errors.length > 0) {
    const error = new Error(errors.join(" "));
    error.status = 400;
    throw error;
  }

  return {
    customer_name: String(data.customer_name).trim(),
    phone,
    email: data.email ? String(data.email).trim() : null,
    address: data.address ? String(data.address).trim() : null
  };
}

function getAllCustomers() {
  return customerRepository.getAll();
}

function getCustomerById(id) {
  const customer = customerRepository.getById(id);

  if (!customer) {
    const error = new Error("Không tìm thấy khách hàng.");
    error.status = 404;
    throw error;
  }

  return customer;
}

function createCustomer(data) {
  const customerData = validateCustomer(data);

  if (customerRepository.getByPhone(customerData.phone)) {
    const error = new Error("Số điện thoại đã tồn tại.");
    error.status = 409;
    throw error;
  }

  return customerRepository.create(customerData);
}

function updateCustomer(id, data) {
  const existingCustomer = customerRepository.getById(id);

  if (!existingCustomer) {
    const error = new Error("Không tìm thấy khách hàng.");
    error.status = 404;
    throw error;
  }

  const customerData = validateCustomer(data);
  const duplicate = customerRepository.getByPhone(customerData.phone);

  if (duplicate && duplicate.customer_id !== Number(id)) {
    const error = new Error("Số điện thoại đã thuộc khách hàng khác.");
    error.status = 409;
    throw error;
  }

  return customerRepository.update(Number(id), customerData);
}

module.exports = {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer
};

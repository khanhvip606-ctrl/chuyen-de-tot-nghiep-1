
const db = require("../database/db");

const findAll = db.prepare(`
  SELECT customer_id, customer_name, phone, email, address
  FROM customer
  ORDER BY customer_id DESC
`);

const findById = db.prepare(`
  SELECT customer_id, customer_name, phone, email, address
  FROM customer
  WHERE customer_id = ?
`);

const findByPhone = db.prepare(`
  SELECT customer_id, customer_name, phone, email, address
  FROM customer
  WHERE phone = ?
`);

const insertCustomer = db.prepare(`
  INSERT INTO customer (customer_name, phone, email, address)
  VALUES (@customer_name, @phone, @email, @address)
`);

const updateCustomer = db.prepare(`
  UPDATE customer
  SET customer_name = @customer_name,
      phone = @phone,
      email = @email,
      address = @address
  WHERE customer_id = @customer_id
`);

function getAll() {
  return findAll.all();
}

function getById(id) {
  return findById.get(id);
}

function getByPhone(phone) {
  return findByPhone.get(phone);
}

function create(data) {
  const result = insertCustomer.run(data);

  return getById(Number(result.lastInsertRowid));
}

function update(id, data) {
  updateCustomer.run({
    customer_id: id,
    ...data
  });

  return getById(id);
}

module.exports = {
  getAll,
  getById,
  getByPhone,
  create,
  update
};

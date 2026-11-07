
const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "crm-customer-test-"));
process.env.DB_PATH = path.join(tempDir, "customer-test.db");

const db = require("../src/database/db");

let customerService;

before(() => {
  const schema = fs.readFileSync(
    path.join(__dirname, "../src/database/schema.sql"),
    "utf8"
  );

  db.exec(schema);
  customerService = require("../src/services/customerService");
});

after(() => {
  db.close();
  fs.rmSync(tempDir, { recursive: true, force: true });
});

function validCustomer(phone = "0900000001") {
  return {
    customer_name: "Nguyen Van A",
    phone,
    email: "a@example.com",
    address: "Ho Chi Minh"
  };
}

test("Tạo khách hàng với dữ liệu hợp lệ", () => {
  const customer = customerService.createCustomer(validCustomer());

  assert.equal(customer.customer_name, "Nguyen Van A");
  assert.equal(customer.phone, "0900000001");
  assert.equal(customer.is_active, 1);
});

test("Từ chối tên khách hàng để trống", () => {
  const data = validCustomer("0900000002");
  data.customer_name = "   ";

  assert.throws(
    () => customerService.createCustomer(data),
    (error) => error.status === 400
  );
});

test("Từ chối số điện thoại không đúng định dạng", () => {
  const invalidPhones = [
    "123456789",
    "090000000",
    "1900000001",
    "09000000001"
  ];

  for (const phone of invalidPhones) {
    assert.throws(
      () => customerService.createCustomer(validCustomer(phone)),
      (error) => error.status === 400
    );
  }
});

test("Từ chối email sai định dạng", () => {
  const data = validCustomer("0900000003");
  data.email = "email-sai";

  assert.throws(
    () => customerService.createCustomer(data),
    (error) => error.status === 400
  );
});

test("Từ chối tạo khách hàng trùng số điện thoại", () => {
  assert.throws(
    () => customerService.createCustomer(validCustomer("0900000001")),
    (error) => error.status === 409
  );
});

test("Cho phép cập nhật thông tin nhưng giữ số điện thoại của chính khách hàng", () => {
  const customer = customerService.getCustomerById(1);

  const updated = customerService.updateCustomer(
    customer.customer_id,
    {
      ...validCustomer("0900000001"),
      customer_name: "Nguyen Van B"
    }
  );

  assert.equal(updated.customer_name, "Nguyen Van B");
});

test("Từ chối cập nhật bằng số điện thoại của khách hàng khác", () => {
  const second = customerService.createCustomer(validCustomer("0900000004"));

  assert.throws(
    () => customerService.updateCustomer(1, validCustomer("0900000004")),
    (error) => error.status === 409
  );

  assert.ok(second.customer_id);
});

test("Ngừng hoạt động khách hàng nhưng vẫn giữ dữ liệu", () => {
  const result = customerService.deleteCustomer(1);

  assert.equal(result.is_active, 0);

  const stored = db.prepare(
    "SELECT * FROM customer WHERE customer_id = ?"
  ).get(1);

  assert.ok(stored);
  assert.equal(stored.is_active, 0);
});

test("Không trả về khách hàng đã ngừng hoạt động", () => {
  const customers = customerService.getAllCustomers();

  assert.equal(
    customers.some((customer) => customer.customer_id === 1),
    false
  );
});

test("Không tìm thấy khách hàng đã ngừng hoạt động", () => {
  assert.throws(
    () => customerService.getCustomerById(1),
    (error) => error.status === 404
  );
});

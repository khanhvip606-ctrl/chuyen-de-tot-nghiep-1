
const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "crm-device-test-"));
process.env.DB_PATH = path.join(tempDir, "device-test.db");

const db = require("../src/database/db");

let customerService;
let deviceService;
let phoneCounter = 10;

function createCustomer() {
  phoneCounter++;

  return customerService.createCustomer({
    customer_name: "Khach hang test",
    phone: `09000000${String(phoneCounter).padStart(2, "0")}`
  });
}

function validDevice(customerId, serial = "SN-TEST-001") {
  return {
    customer_id: customerId,
    serial_number: serial,
    device_name: "Laptop Dell",
    purchase_date: "2026-01-01",
    warranty_expiry: "2027-01-01"
  };
}

before(() => {
  const schema = fs.readFileSync(
    path.join(__dirname, "../src/database/schema.sql"),
    "utf8"
  );

  db.exec(schema);

  customerService = require("../src/services/customerService");
  deviceService = require("../src/services/deviceService");
});

after(() => {
  db.close();
  fs.rmSync(tempDir, { recursive: true, force: true });
});

test("Tạo thiết bị với dữ liệu hợp lệ", () => {
  const customer = createCustomer();
  const device = deviceService.createDevice(
    validDevice(customer.customer_id)
  );

  assert.equal(device.serial_number, "SN-TEST-001");
  assert.equal(device.device_name, "Laptop Dell");
  assert.equal(device.is_active, 1);
});

test("Từ chối mã khách hàng không hợp lệ", () => {
  assert.throws(
    () => deviceService.createDevice(validDevice(0)),
    (error) => error.status === 400
  );
});

test("Từ chối mã khách hàng không tồn tại", () => {
  assert.throws(
    () => deviceService.createDevice(validDevice(999999)),
    (error) => error.status === 400
  );
});

test("Từ chối thiết bị thuộc khách hàng đã ngừng hoạt động", () => {
  const customer = createCustomer();
  customerService.deleteCustomer(customer.customer_id);

  assert.throws(
    () => deviceService.createDevice(validDevice(customer.customer_id)),
    (error) => error.status === 400
  );
});

test("Từ chối serial number để trống", () => {
  const customer = createCustomer();
  const data = validDevice(customer.customer_id);
  data.serial_number = "   ";

  assert.throws(
    () => deviceService.createDevice(data),
    (error) => error.status === 400
  );
});

test("Từ chối tên thiết bị để trống", () => {
  const customer = createCustomer();
  const data = validDevice(customer.customer_id);
  data.device_name = "   ";

  assert.throws(
    () => deviceService.createDevice(data),
    (error) => error.status === 400
  );
});

test("Từ chối tạo thiết bị trùng serial number", () => {
  const customer = createCustomer();

  deviceService.createDevice(
    validDevice(customer.customer_id, "SN-DUPLICATE")
  );

  assert.throws(
    () => deviceService.createDevice(
      validDevice(customer.customer_id, "SN-DUPLICATE")
    ),
    (error) => error.status === 409
  );
});

test("Cho phép cập nhật thiết bị và giữ serial của chính nó", () => {
  const customer = createCustomer();
  const device = deviceService.createDevice(
    validDevice(customer.customer_id, "SN-UPDATE")
  );

  const updated = deviceService.updateDevice(
    device.device_id,
    {
      ...validDevice(customer.customer_id, "SN-UPDATE"),
      device_name: "Laptop HP"
    }
  );

  assert.equal(updated.device_name, "Laptop HP");
  assert.equal(updated.serial_number, "SN-UPDATE");
});

test("Từ chối cập nhật bằng serial của thiết bị khác", () => {
  const customer = createCustomer();

  const first = deviceService.createDevice(
    validDevice(customer.customer_id, "SN-FIRST")
  );

  deviceService.createDevice(
    validDevice(customer.customer_id, "SN-SECOND")
  );

  assert.throws(
    () => deviceService.updateDevice(
      first.device_id,
      validDevice(customer.customer_id, "SN-SECOND")
    ),
    (error) => error.status === 409
  );
});

test("Ngừng hoạt động thiết bị nhưng vẫn giữ dữ liệu", () => {
  const customer = createCustomer();
  const device = deviceService.createDevice(
    validDevice(customer.customer_id, "SN-DELETE")
  );

  const result = deviceService.deleteDevice(device.device_id);

  assert.equal(result.is_active, 0);

  const stored = db.prepare(
    "SELECT * FROM device WHERE device_id = ?"
  ).get(device.device_id);

  assert.ok(stored);
  assert.equal(stored.is_active, 0);
});

test("Không tìm thấy thiết bị đã ngừng hoạt động", () => {
  const customer = createCustomer();
  const device = deviceService.createDevice(
    validDevice(customer.customer_id, "SN-INACTIVE")
  );

  deviceService.deleteDevice(device.device_id);

  assert.throws(
    () => deviceService.getDeviceById(device.device_id),
    (error) => error.status === 404
  );
});

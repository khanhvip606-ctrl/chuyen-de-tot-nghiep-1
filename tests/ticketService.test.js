const { test, after } = require("node:test");
const assert = require("node:assert/strict");
const Database = require("better-sqlite3");
const fs = require("fs");
const os = require("os");
const path = require("path");

// Tao database tam rieng cho bo kiem thu.
const previousDbPath = process.env.DB_PATH;
const testDir = fs.mkdtempSync(path.join(os.tmpdir(), "smart-crm-tests-"));
const testDbPath = path.join(testDir, "smart-crm-test.db");

process.env.DB_PATH = testDbPath;

// Khoi tao schema va du lieu mau truoc khi nap service.
const setupDb = new Database(testDbPath);
const schemaPath = path.join(
  __dirname,
  "..",
  "src",
  "database",
  "schema.sql"
);

setupDb.exec(fs.readFileSync(schemaPath, "utf8"));

const customer = setupDb.prepare(`
  INSERT INTO customer (customer_name, phone, email, address)
  VALUES (?, ?, ?, ?)
`).run("Khach hang kiem thu", "0901234567", "test@example.com", "Dia chi test");

const device = setupDb.prepare(`
  INSERT INTO device (
    customer_id, serial_number, device_name, purchase_date, warranty_expiry
  )
  VALUES (?, ?, ?, ?, ?)
`).run(
  Number(customer.lastInsertRowid),
  "TEST-SERIAL-001",
  "Thiet bi kiem thu",
  "2026-01-01",
  "2027-01-01"
);

setupDb.prepare(`
  INSERT INTO ticket (
    ticket_code, customer_id, device_id, issue_category,
    issue_description, priority, status
  )
  VALUES (?, ?, ?, ?, ?, ?, ?)
`).run(
  "TKT-TEST-001",
  Number(customer.lastInsertRowid),
  Number(device.lastInsertRowid),
  "PHAN_CUNG",
  "Mo ta loi kiem thu",
  "CAO",
  "MOI"
);

setupDb.close();

// Nap service sau khi da cau hinh database test.
const ticketService = require("../src/services/ticketService");
const testDb = require("../src/database/db");

// Dong va xoa database tam sau khi hoan tat kiem thu.
after(() => {
  testDb.close();
  fs.rmSync(testDir, { recursive: true, force: true });

  if (previousDbPath === undefined) {
    delete process.env.DB_PATH;
  } else {
    process.env.DB_PATH = previousDbPath;
  }
});

// Test 1: Tu choi khi thieu du lieu bat buoc
test("Tu choi phieu khi thieu du lieu bat buoc", () => {
  assert.throws(
    () => ticketService.createTicket({}),
    (error) => {
      assert.equal(error.status, 400);
      assert.match(error.message, /customer_id khong hop le/);
      assert.match(error.message, /device_id khong hop le/);
      assert.match(error.message, /Nhom loi khong hop le/);
      assert.match(error.message, /Mo ta loi khong duoc de trong/);
      assert.match(error.message, /Muc do uu tien khong hop le/);
      return true;
    }
  );
});

// Test 2: Tu choi muc do uu tien khong hop le
test("Tu choi phieu khi muc do uu tien khong hop le", () => {
  assert.throws(
    () =>
      ticketService.createTicket({
        customer_id: 0,
        device_id: 0,
        issue_category: "PHAN_CUNG",
        issue_description: "May khong khoi dong",
        priority: "KHAN_CAP"
      }),
    (error) => {
      assert.equal(error.status, 400);
      assert.match(error.message, /Muc do uu tien khong hop le/);
      return true;
    }
  );
});

// Test 3: Tu choi ID phieu bang 0
test("Tu choi khi ID phieu bang 0", () => {
  assert.throws(
    () => ticketService.getTicketById(0),
    (error) => {
      assert.equal(error.status, 400);
      assert.match(error.message, /ID phieu bao hanh khong hop le/);
      return true;
    }
  );
});

// Test 4: Tu choi ID phieu khong phai so
test("Tu choi khi ID phieu khong phai so", () => {
  assert.throws(
    () => ticketService.getTicketById("abc"),
    (error) => {
      assert.equal(error.status, 400);
      assert.match(error.message, /ID phieu bao hanh khong hop le/);
      return true;
    }
  );
});

// Test 5: Tu choi ID am khi lay lich su
test("Tu choi khi ID am khi lay lich su trang thai", () => {
  assert.throws(
    () => ticketService.getTicketStatusHistory(-1),
    (error) => {
      assert.equal(error.status, 400);
      assert.match(error.message, /ID phieu bao hanh khong hop le/);
      return true;
    }
  );
});

// Test 6: Lay danh sach phieu
test("Lay danh sach phieu bao hanh thanh cong", () => {
  const tickets = ticketService.getAllTickets();

  assert.ok(Array.isArray(tickets));
  assert.ok(tickets.length > 0);
});

// Test 7: Lay chi tiet phieu
test("Lay chi tiet phieu bao hanh thanh cong", () => {
  const tickets = ticketService.getAllTickets();
  assert.ok(tickets.length > 0);

  const ticket = ticketService.getTicketById(tickets[0].ticket_id);

  assert.equal(ticket.ticket_id, tickets[0].ticket_id);
  assert.ok(ticket.ticket_code);
});

// Test 8: Boundary - Ghi chu dung 500 ky tu
test("Chap nhan ghi chu co dung 500 ky tu", () => {
  const tickets = ticketService.getAllTickets();
  assert.ok(tickets.length > 0);

  const existingTicket = tickets[0];

  const result = ticketService.updateTicketStatus(
    existingTicket.ticket_id,
    {
      status: existingTicket.status,
      note: "A".repeat(500)
    }
  );

  assert.equal(result.changed, false);
  assert.equal(result.ticket.ticket_id, existingTicket.ticket_id);
});

// Test 9: Tu choi ghi chu vuot qua 500 ky tu
test("Tu choi ghi chu vuot qua 500 ky tu", () => {
  const tickets = ticketService.getAllTickets();
  assert.ok(tickets.length > 0);

  const existingTicket = tickets[0];

  assert.throws(
    () =>
      ticketService.updateTicketStatus(
        existingTicket.ticket_id,
        {
          status: existingTicket.status,
          note: "A".repeat(501)
        }
      ),
    (error) => {
      assert.equal(error.status, 400);
      assert.match(error.message, /Ghi chu khong duoc vuot qua 500 ky tu/);
      return true;
    }
  );
});

// Test 10: SLA CAO - 24 gio lam viec
test("Tinh SLA CAO theo 24 gio lam viec", () => {
  const result = ticketService.calculateSla(
    "CAO",
    new Date("2026-11-02T01:00:00.000Z")
  );

  assert.equal(result, "2026-11-04T07:00:00.000Z");
});

// Test 11: SLA TRUNG_BINH - 72 gio lam viec
test("Tinh SLA TRUNG_BINH theo 72 gio lam viec", () => {
  const result = ticketService.calculateSla(
    "TRUNG_BINH",
    new Date("2026-11-02T01:00:00.000Z")
  );

  assert.equal(result, "2026-11-10T10:00:00.000Z");
});

// Test 12: SLA THAP - 120 gio lam viec
test("Tinh SLA THAP theo 120 gio lam viec", () => {
  const result = ticketService.calculateSla(
    "THAP",
    new Date("2026-11-02T01:00:00.000Z")
  );

  assert.equal(result, "2026-11-17T04:00:00.000Z");
});
// Test 13: Tao phieu vao Chu nhat
test("SLA bat dau vao thu Hai neu tao phieu vao Chu nhat", () => {
  const result = ticketService.calculateSla(
    "CAO",
    new Date("2026-11-01T03:00:00.000Z")
  );

  assert.equal(result, "2026-11-04T07:00:00.000Z");
});

// Test 14: Tao phieu sau gio lam viec
test("SLA bat dau tu ngay lam viec tiep theo neu tao phieu sau 17:00", () => {
  const result = ticketService.calculateSla(
    "CAO",
    new Date("2026-11-02T11:00:00.000Z")
  );

  assert.equal(result, "2026-11-05T07:00:00.000Z");
});

// Test 15: SLA di qua Chu nhat
test("SLA bo qua Chu nhat khi tinh thoi han", () => {
  const result = ticketService.calculateSla(
    "CAO",
    new Date("2026-10-31T09:00:00.000Z")
  );

  assert.equal(result, "2026-11-04T06:00:00.000Z");
});

// Test 16: Tu choi thoi diem khong hop le
test("Tu choi thoi diem tao phieu khong hop le", () => {
  assert.throws(
    () => ticketService.calculateSla("CAO", "invalid-date"),
    (error) => {
      assert.equal(error.status, 400);
      assert.match(error.message, /Thoi diem tao phieu khong hop le/);
      return true;
    }
  );
});

// Test 17: Tu choi muc do uu tien khong hop le khi tinh SLA
test("Tu choi muc do uu tien khong hop le khi tinh SLA", () => {
  assert.throws(
    () => ticketService.calculateSla("KHAN_CAP"),
    (error) => {
      assert.equal(error.status, 400);
      assert.match(error.message, /Muc do uu tien khong hop le/);
      return true;
    }
  );
});

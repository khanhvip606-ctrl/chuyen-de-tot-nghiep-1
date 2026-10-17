
const db = require("./db");

const seed = db.transaction(() => {
  // 1. Them khach hang mau
  const insertCustomer = db.prepare(`
    INSERT OR IGNORE INTO customer (
      customer_name,
      phone,
      email,
      address
    )
    VALUES (?, ?, ?, ?)
  `);

  insertCustomer.run(
    "Nguyen Van An",
    "0901234567",
    "an.demo@example.com",
    "Ho Chi Minh"
  );

  insertCustomer.run(
    "Tran Thi Binh",
    "0912345678",
    "binh.demo@example.com",
    "Ho Chi Minh"
  );

  const getCustomerByPhone = db.prepare(`
    SELECT customer_id
    FROM customer
    WHERE phone = ?
  `);

  const customerA = getCustomerByPhone.get("0901234567");
  const customerB = getCustomerByPhone.get("0912345678");

  if (!customerA || !customerB) {
    throw new Error("Cannot find seeded customers.");
  }

  // 2. Them thiet bi mau
  const insertDevice = db.prepare(`
    INSERT OR IGNORE INTO device (
      customer_id,
      serial_number,
      device_name,
      purchase_date,
      warranty_expiry
    )
    VALUES (?, ?, ?, ?, ?)
  `);

  insertDevice.run(
    customerA.customer_id,
    "SN-DEMO-0001",
    "Mekong Mobile X1",
    "2026-01-15",
    "2027-01-15"
  );

  insertDevice.run(
    customerB.customer_id,
    "SN-DEMO-0002",
    "Mekong Mobile X2",
    "2026-02-15",
    "2027-02-15"
  );

  const getDeviceBySerial = db.prepare(`
    SELECT device_id, customer_id
    FROM device
    WHERE serial_number = ?
  `);

  const deviceA = getDeviceBySerial.get("SN-DEMO-0001");
  const deviceB = getDeviceBySerial.get("SN-DEMO-0002");

  if (
    !deviceA ||
    !deviceB ||
    deviceA.customer_id !== customerA.customer_id ||
    deviceB.customer_id !== customerB.customer_id
  ) {
    throw new Error(
      "A demo serial number is linked to another customer."
    );
  }

  // 3. Them ky thuat vien mau, khong them trung khi chay lai
  const technicianName = "Tran Minh Khoa";
  const technicianPhone = "0987654321";

  const findTechnician = db.prepare(`
    SELECT technician_id
    FROM technician
    WHERE technician_name = ?
      AND phone = ?
    LIMIT 1
  `);

  let technician = findTechnician.get(
    technicianName,
    technicianPhone
  );

  if (!technician) {
    db.prepare(`
      INSERT INTO technician (
        technician_name,
        phone,
        email,
        specialization
      )
      VALUES (?, ?, ?, ?)
    `).run(
      technicianName,
      technicianPhone,
      "khoa.demo@example.com",
      "Phan mem"
    );

    technician = findTechnician.get(
      technicianName,
      technicianPhone
    );
  }

  if (!technician) {
    throw new Error("Cannot find seeded technician.");
  }

  // 4. Tao phieu bao hanh mau
  // ticket_code la UNIQUE, INSERT OR IGNORE tranh tao trung phieu
  const insertTicket = db.prepare(`
    INSERT OR IGNORE INTO ticket (
      ticket_code,
      customer_id,
      device_id,
      technician_id,
      issue_category,
      issue_description,
      priority,
      status,
      created_at,
      sla_due_at
    )
    VALUES (
      ?, ?, ?, ?, ?, ?, ?, 'MOI',
      CURRENT_TIMESTAMP,
      datetime('now', ?)
    )
  `);

  insertTicket.run(
    "DEMO-TKT-001",
    customerA.customer_id,
    deviceA.device_id,
    technician.technician_id,
    "PHAN_MEM",
    "May khong mo duoc ung dung.",
    "TRUNG_BINH",
    "+72 hours"
  );

  insertTicket.run(
    "DEMO-TKT-002",
    customerB.customer_id,
    deviceB.device_id,
    technician.technician_id,
    "PHAN_CUNG",
    "Man hinh thiet bi khong hien thi.",
    "CAO",
    "+24 hours"
  );

  // 5. Them lich su trang thai cho cac phieu mau
  // Khong chen lai neu da co dong log tu seed
  const insertLogIfMissing = db.prepare(`
    INSERT INTO ticket_status_log (
      ticket_id,
      old_status,
      new_status,
      note,
      changed_by
    )
    SELECT ?, NULL, 'MOI', 'Seed data', 'seed'
    WHERE NOT EXISTS (
      SELECT 1
      FROM ticket_status_log
      WHERE ticket_id = ?
        AND new_status = 'MOI'
        AND note = 'Seed data'
        AND changed_by = 'seed'
    )
  `);

  const seededTickets = db.prepare(`
    SELECT ticket_id
    FROM ticket
    WHERE ticket_code IN (
      'DEMO-TKT-001',
      'DEMO-TKT-002'
    )
  `).all();

  for (const ticket of seededTickets) {
    insertLogIfMissing.run(
      ticket.ticket_id,
      ticket.ticket_id
    );
  }
});

try {
  seed();

  console.log("Seed completed successfully.");

  const tableNames = [
    "customer",
    "device",
    "technician",
    "ticket",
    "ticket_status_log"
  ];

  for (const tableName of tableNames) {
    const result = db.prepare(
      `SELECT COUNT(*) AS total FROM ${tableName}`
    ).get();

    console.log(`${tableName}: ${result.total} rows`);
  }
} catch (error) {
  console.error("Seed failed:", error.message);
  process.exitCode = 1;
} finally {
  db.close();
}

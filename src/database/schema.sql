
CREATE TABLE IF NOT EXISTS customer (
    customer_id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL UNIQUE CHECK (
        length(phone) = 10
        AND phone GLOB '0[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]'
    ),
    email TEXT,
    address TEXT
);

CREATE TABLE IF NOT EXISTS device (
    device_id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER NOT NULL REFERENCES customer(customer_id),
    serial_number TEXT NOT NULL UNIQUE,
    device_name TEXT NOT NULL,
    purchase_date TEXT,
    warranty_expiry TEXT
);

CREATE TABLE IF NOT EXISTS technician (
    technician_id INTEGER PRIMARY KEY AUTOINCREMENT,
    technician_name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    specialization TEXT
);

CREATE TABLE IF NOT EXISTS ticket (
    ticket_id INTEGER PRIMARY KEY AUTOINCREMENT,
    ticket_code TEXT NOT NULL UNIQUE,
    customer_id INTEGER NOT NULL REFERENCES customer(customer_id),
    device_id INTEGER NOT NULL REFERENCES device(device_id),
    technician_id INTEGER REFERENCES technician(technician_id),
    issue_category TEXT NOT NULL,
    issue_description TEXT NOT NULL,
    priority TEXT NOT NULL CHECK (
        priority IN ('CAO', 'TRUNG_BINH', 'THAP')
    ),
    status TEXT NOT NULL DEFAULT 'MOI',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    sla_due_at TEXT
);

CREATE TABLE IF NOT EXISTS ticket_status_log (
    log_id INTEGER PRIMARY KEY AUTOINCREMENT,
    ticket_id INTEGER NOT NULL REFERENCES ticket(ticket_id),
    old_status TEXT,
    new_status TEXT NOT NULL,
    note TEXT,
    changed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    changed_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_device_customer ON device(customer_id);
CREATE INDEX IF NOT EXISTS idx_ticket_customer ON ticket(customer_id);
CREATE INDEX IF NOT EXISTS idx_ticket_device ON ticket(device_id);
CREATE INDEX IF NOT EXISTS idx_ticket_category ON ticket(issue_category);
CREATE INDEX IF NOT EXISTS idx_ticket_status ON ticket(status);
CREATE INDEX IF NOT EXISTS idx_status_log_ticket_time
    ON ticket_status_log(ticket_id, changed_at);

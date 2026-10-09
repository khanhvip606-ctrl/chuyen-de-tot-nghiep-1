
CREATE TABLE customer (
    customer_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    customer_name VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(150),
    address VARCHAR(255)
);

CREATE TABLE device (
    device_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    customer_id BIGINT NOT NULL
        REFERENCES customer(customer_id),
    serial_number VARCHAR(100) NOT NULL UNIQUE,
    device_name VARCHAR(150) NOT NULL,
    purchase_date DATE,
    warranty_expiry DATE
);

CREATE TABLE technician (
    technician_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    technician_name VARCHAR(150) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(150),
    specialization VARCHAR(100)
);

CREATE TABLE issue_category (
    issue_category_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    category_name VARCHAR(80) NOT NULL UNIQUE,
    description VARCHAR(255),
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE ticket (
    ticket_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    ticket_code VARCHAR(30) NOT NULL UNIQUE,
    device_id BIGINT NOT NULL
        REFERENCES device(device_id),
    issue_category_id BIGINT NOT NULL
        REFERENCES issue_category(issue_category_id),
    technician_id BIGINT
        REFERENCES technician(technician_id),
    issue_description TEXT NOT NULL,
    priority VARCHAR(20) NOT NULL
        CHECK (priority IN ('CAO', 'TRUNG_BINH', 'THAP')),
    status VARCHAR(30) NOT NULL DEFAULT 'MOI',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    sla_due_at TIMESTAMP
);

CREATE TABLE ticket_status_log (
    log_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    ticket_id BIGINT NOT NULL
        REFERENCES ticket(ticket_id),
    old_status VARCHAR(30),
    new_status VARCHAR(30) NOT NULL,
    note TEXT,
    changed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    changed_by VARCHAR(100)
);

-- Indexes for common searches
CREATE INDEX idx_device_customer
    ON device(customer_id);

CREATE INDEX idx_ticket_device
    ON ticket(device_id);

CREATE INDEX idx_ticket_category
    ON ticket(issue_category_id);

CREATE INDEX idx_ticket_status
    ON ticket(status);

CREATE INDEX idx_status_log_ticket_time
    ON ticket_status_log(ticket_id, changed_at);
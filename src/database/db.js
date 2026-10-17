
const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");

const dataDir = path.join(__dirname, "..", "..", "data");

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, "smart-crm.db");
const db = new Database(dbPath);

// Bật kiểm tra khóa ngoại trong SQLite.
db.pragma("foreign_keys = ON");

// Tăng độ an toàn khi nhiều thao tác đọc/ghi cùng lúc.
db.pragma("journal_mode = WAL");

module.exports = db;

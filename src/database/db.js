const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");

const defaultDataDir = path.join(__dirname, "..", "..", "data");

let dbPath;

if (process.env.DB_PATH) {
  // Cho phep su dung database rieng khi kiem thu.
  dbPath = path.resolve(process.env.DB_PATH);

  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
} else {
  // Database chinh cua ung dung.
  fs.mkdirSync(defaultDataDir, { recursive: true });
  dbPath = path.join(defaultDataDir, "smart-crm.db");
}

const db = new Database(dbPath);

// Bat kiem tra khoa ngoai.
db.pragma("foreign_keys = ON");

// Ho tro nhieu thao tac doc/ghi.
db.pragma("journal_mode = WAL");

module.exports = db;
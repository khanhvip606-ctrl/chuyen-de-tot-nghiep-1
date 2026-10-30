
const fs = require("fs");
const path = require("path");
const db = require("./db");

function addColumnIfMissing(tableName, columnName, definition) {
  const columns = db.prepare(
    `PRAGMA table_info(${tableName})`
  ).all();

  const exists = columns.some(
    (column) => column.name === columnName
  );

  if (!exists) {
    db.exec(
      `ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${definition}`
    );

    console.log(`Da them cot ${tableName}.${columnName}`);
  } else {
    console.log(`Cot ${tableName}.${columnName} da ton tai.`);
  }
}

try {
  const schemaPath = path.join(__dirname, "schema.sql");
  const schema = fs.readFileSync(schemaPath, "utf8");

  // Tao cac bang neu chua ton tai.
  db.exec(schema);

  // Bo sung cot cho database cu.
  addColumnIfMissing(
    "customer",
    "is_active",
    "INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1))"
  );

  addColumnIfMissing(
    "device",
    "is_active",
    "INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1))"
  );

  const tables = db.prepare(`
    SELECT name
    FROM sqlite_master
    WHERE type = 'table'
      AND name NOT LIKE 'sqlite_%'
    ORDER BY name
  `).all();

  console.log("Khoi tao database thanh cong!");
  console.log("Danh sach bang:");

  for (const table of tables) {
    console.log("- " + table.name);
  }
} catch (error) {
  console.error("Loi khoi tao database:", error.message);
  process.exitCode = 1;
} finally {
  db.close();
}

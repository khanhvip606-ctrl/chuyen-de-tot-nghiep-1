
const fs = require("fs");
const path = require("path");
const db = require("./db");

try {
  const schemaPath = path.join(__dirname, "schema.sql");
  const schema = fs.readFileSync(schemaPath, "utf8");

  db.exec(schema);

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

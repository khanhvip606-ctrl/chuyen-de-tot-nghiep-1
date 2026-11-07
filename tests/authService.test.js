
const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");
const crypto = require("crypto");

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "crm-auth-test-"));
process.env.DB_PATH = path.join(tempDir, "auth-test.db");

const db = require("../src/database/db");

const schema = fs.readFileSync(
  path.join(__dirname, "../src/database/schema.sql"),
  "utf8"
);

// Tao bang truoc khi nap repository.
db.exec(schema);

const authRepository = require("../src/repositories/authRepository");
const authService = require("../src/services/authService");

let user;

before(() => {
  authRepository.createUser(
    "staff_test",
    authService.hashPassword("Password123"),
    "STAFF"
  );

  user = authRepository.getByUsername("staff_test");
});

after(() => {
  db.close();
  fs.rmSync(tempDir, { recursive: true, force: true });
});

test("Tao va xac minh mat khau dung", () => {
  const hash = authService.hashPassword("Password123");

  assert.equal(authService.verifyPassword("Password123", hash), true);
  assert.equal(authService.verifyPassword("WrongPassword", hash), false);
});

test("Tu choi dang nhap khi thieu thong tin", () => {
  assert.throws(
    () => authService.login("", "Password123"),
    (error) => error.status === 400
  );
});

test("Tu choi dang nhap khi tai khoan khong ton tai", () => {
  assert.throws(
    () => authService.login("unknown_user", "Password123"),
    (error) => error.status === 401
  );
});

test("Tu choi dang nhap khi sai mat khau", () => {
  assert.throws(
    () => authService.login("staff_test", "WrongPassword"),
    (error) => error.status === 401
  );
});

test("Dang nhap thanh cong va tao phien", () => {
  const result = authService.login("staff_test", "Password123");

  assert.ok(result.token);
  assert.equal(result.user.username, "staff_test");
  assert.equal(result.user.role, "STAFF");
  assert.ok(result.expires_at);
});

test("Xac thuc token dang nhap hop le", () => {
  const result = authService.login("staff_test", "Password123");
  const authenticated = authService.authenticate(result.token);

  assert.equal(authenticated.username, "staff_test");
  assert.equal(authenticated.user_id, user.user_id);
});

test("Dang xuat va tu choi token da dang xuat", () => {
  const result = authService.login("staff_test", "Password123");

  assert.equal(authService.logout(result.token), true);
  assert.equal(authService.authenticate(result.token), null);
});

test("Tu choi token da het han", () => {
  const token = "expired-test-token";
  const tokenHash = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  authRepository.createSession(
    user.user_id,
    tokenHash,
    "2000-01-01 00:00:00"
  );

  assert.equal(authService.authenticate(token), null);
});


const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "crm-middleware-test-"));
process.env.DB_PATH = path.join(tempDir, "middleware-test.db");

const db = require("../src/database/db");

let authService;
let authMiddleware;
let originalAuthenticate;

before(() => {
  const schema = fs.readFileSync(
    path.join(__dirname, "../src/database/schema.sql"),
    "utf8"
  );

  db.exec(schema);

  authService = require("../src/services/authService");
  authMiddleware = require("../src/middlewares/authMiddleware");
  originalAuthenticate = authService.authenticate;
});

after(() => {
  authService.authenticate = originalAuthenticate;
  db.close();
  fs.rmSync(tempDir, { recursive: true, force: true });
});

function createResponse() {
  return {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.body = data;
      return this;
    }
  };
}

test("Từ chối request khi thiếu Authorization", () => {
  const req = { headers: {} };
  const res = createResponse();
  let nextCalled = false;

  authMiddleware(req, res, () => {
    nextCalled = true;
  });

  assert.equal(res.statusCode, 401);
  assert.equal(nextCalled, false);
});

test("Từ chối Authorization không dùng Bearer", () => {
  const req = { headers: { authorization: "Basic abc123" } };
  const res = createResponse();
  let nextCalled = false;

  authMiddleware(req, res, () => {
    nextCalled = true;
  });

  assert.equal(res.statusCode, 401);
  assert.equal(nextCalled, false);
});

test("Từ chối Bearer không có token", () => {
  const req = { headers: { authorization: "Bearer   " } };
  const res = createResponse();
  let nextCalled = false;

  authMiddleware(req, res, () => {
    nextCalled = true;
  });

  assert.equal(res.statusCode, 401);
  assert.equal(nextCalled, false);
});

test("Từ chối token không hợp lệ", () => {
  authService.authenticate = () => null;

  const req = { headers: { authorization: "Bearer invalid-token" } };
  const res = createResponse();
  let nextCalled = false;

  authMiddleware(req, res, () => {
    nextCalled = true;
  });

  assert.equal(res.statusCode, 401);
  assert.equal(nextCalled, false);
});

test("Cho phép request có token hợp lệ", () => {
  const user = { user_id: 1, username: "staff_test" };
  authService.authenticate = () => user;

  const req = { headers: { authorization: "Bearer valid-token" } };
  const res = createResponse();
  let nextCalled = false;

  authMiddleware(req, res, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, true);
  assert.equal(req.user, user);
  assert.equal(res.statusCode, 200);
});

test("Chấp nhận Bearer viết thường theo chuẩn HTTP", () => {
  const user = { user_id: 1, username: "staff_test" };
  authService.authenticate = () => user;

  const req = { headers: { authorization: "bearer valid-token" } };
  const res = createResponse();
  let nextCalled = false;

  authMiddleware(req, res, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, true);
  assert.equal(req.user, user);
});

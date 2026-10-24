const { test } = require("node:test");
const assert = require("node:assert/strict");

const ticketService = require("../src/services/ticketService");

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
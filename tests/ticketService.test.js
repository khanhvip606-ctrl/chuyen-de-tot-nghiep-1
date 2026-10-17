
const { test } = require("node:test");
const assert = require("node:assert/strict");

const ticketService = require("../src/services/ticketService");

test("Từ chối phiếu bảo hành khi dữ liệu bắt buộc bị thiếu", () => {
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

test("Từ chối phiếu bảo hành khi mức độ ưu tiên không hợp lệ", () => {
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

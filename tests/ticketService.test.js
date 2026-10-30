
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

// Test 6: Normal flow - Lay danh sach phieu
test("Lay danh sach phieu bao hanh thanh cong", () => {
  const tickets = ticketService.getAllTickets();

  assert.ok(Array.isArray(tickets));
  assert.ok(tickets.length > 0);
});

// Test 7: Normal flow - Lay chi tiet phieu
test("Lay chi tiet phieu bao hanh thanh cong", () => {
  const tickets = ticketService.getAllTickets();
  assert.ok(tickets.length > 0);

  const ticket = ticketService.getTicketById(tickets[0].ticket_id);

  assert.equal(ticket.ticket_id, tickets[0].ticket_id);
  assert.ok(ticket.ticket_code);
});

// Test 8: Boundary - Ghi chu dung 500 ky tu
test("Chap nhan ghi chu co dung 500 ky tu", () => {
  const tickets = ticketService.getAllTickets();
  assert.ok(tickets.length > 0);

  const existingTicket = tickets[0];

  const result = ticketService.updateTicketStatus(
    existingTicket.ticket_id,
    {
      status: existingTicket.status,
      note: "A".repeat(500)
    }
  );

  assert.equal(result.changed, false);
  assert.equal(result.ticket.ticket_id, existingTicket.ticket_id);
});

// Test 9: Invalid data - Ghi chu vuot qua 500 ky tu
test("Tu choi ghi chu vuot qua 500 ky tu", () => {
  const tickets = ticketService.getAllTickets();
  assert.ok(tickets.length > 0);

  const existingTicket = tickets[0];

  assert.throws(
    () =>
      ticketService.updateTicketStatus(
        existingTicket.ticket_id,
        {
          status: existingTicket.status,
          note: "A".repeat(501)
        }
      ),
    (error) => {
      assert.equal(error.status, 400);
      assert.match(error.message, /Ghi chu khong duoc vuot qua 500 ky tu/);
      return true;
    }
  );
});

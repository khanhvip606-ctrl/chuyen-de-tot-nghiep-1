
# TEST REPORT – SMART CRM MEKONG MOBILE

## 1. Thông tin kiểm thử

- Dự án: Smart CRM Mekong Mobile
- Module: Tiếp nhận và phân loại yêu cầu bảo hành
- Môi trường: Windows, Node.js v22.14.0
- Công cụ: Node.js Test Runner
- Lệnh kiểm thử: `npm test`

## 2. Tổng hợp kết quả

| Nội dung | Kết quả |
|---|---:|
| Tổng số test tự động | 25 |
| PASS | 25 |
| FAIL | 0 |
| SKIPPED | 0 |

Kết quả ghi nhận tại lần chạy kiểm thử ngày 07/11/2026.

## 3. Danh sách test case

| Mã | Nội dung kiểm thử | Kết quả mong đợi | Kết quả thực tế | Trạng thái | Minh chứng |
|---|---|---|---|---|---|
| TC-01 | Đăng nhập đúng thông tin | Tạo phiên và trả token | Đăng nhập thành công, tạo phiên | PASS | kiem-thu-25-test.png |
| TC-02 | Đăng nhập thiếu thông tin | Trả lỗi HTTP 400 | Service trả lỗi 400 | PASS | kiem-thu-25-test.png |
| TC-03 | Đăng nhập tài khoản không tồn tại | Từ chối đăng nhập | Service trả lỗi 401 | PASS | kiem-thu-25-test.png |
| TC-04 | Đăng nhập sai mật khẩu | Từ chối đăng nhập | Service trả lỗi 401 | PASS | kiem-thu-25-test.png |
| TC-05 | Xác thực token hợp lệ | Trả thông tin người dùng | Xác thực thành công | PASS | kiem-thu-25-test.png |
| TC-06 | Sử dụng token đã hết hạn | Từ chối xác thực | Trả về null | PASS | kiem-thu-25-test.png |
| TC-07 | Đăng xuất | Xóa phiên đăng nhập | Xóa phiên thành công | PASS | kiem-thu-25-test.png |
| TC-08 | Tạo phiếu thiếu dữ liệu bắt buộc | Từ chối tạo phiếu | Test xác nhận từ chối | PASS | kiem-thu-25-test.png |
| TC-09 | Nhập mức ưu tiên không hợp lệ | Từ chối dữ liệu | Test xác nhận từ chối | PASS | kiem-thu-25-test.png |
| TC-10 | Ghi chú đúng 500 ký tự | Chấp nhận giới hạn | Test xác nhận chấp nhận | PASS | kiem-thu-25-test.png |
| TC-11 | Ghi chú vượt 500 ký tự | Từ chối dữ liệu | Test xác nhận từ chối | PASS | kiem-thu-25-test.png |
| TC-12 | Tính SLA mức CAO | Tính theo 24 giờ làm việc | Test xác nhận kết quả | PASS | kiem-thu-25-test.png |

## 4. Kiểm thử theo nhóm

- Kiểm thử dữ liệu hợp lệ: TC-01, TC-05, TC-07.
- Kiểm thử dữ liệu biên: TC-10, TC-11.
- Kiểm thử dữ liệu không hợp lệ: TC-02, TC-03, TC-04, TC-08, TC-09.
- Kiểm thử bảo mật và chất lượng dữ liệu: TC-05, TC-06, TC-07.
- Kiểm thử tính lặp lại: đã chạy npm test hai lần liên tiếp, cả hai lần đều đạt 25 PASS, 0 FAIL. Minh chứng: kiem-thu-tong-the.png và kiem-thu-lap-lai.png.

## 5. Kết luận

Tại lần chạy ngày 07/11/2026, bộ kiểm thử tự động ghi nhận 25 PASS và 0 FAIL.

Các kết quả trên xác nhận những trường hợp đã được kiểm thử trong phạm vi service. Chưa thể kết luận toàn bộ API và giao diện đã được kiểm thử tích hợp.

Cần tiếp tục kiểm thử bổ sung các chức năng khách hàng, thiết bị, API và giao diện để mở rộng độ bao phủ.

# TEST REPORT – SMART CRM MEKONG MOBILE

## 1. Thông tin kiểm thử

- Dự án: Smart CRM Mekong Mobile
- Module: Tiếp nhận và phân loại yêu cầu bảo hành
- Môi trường: Windows, Node.js v22.14.0
- Công cụ: Node.js Test Runner
- Lệnh kiểm thử: `npm test`
- Ngày kiểm thử: 07/11/2026

## 2. Tổng hợp kết quả

| Nội dung | Kết quả |
|---|---:|
| Tổng số test tự động | 52 |
| PASS | 52 |
| FAIL | 0 |
| SKIPPED | 0 |

Kết quả được ghi nhận từ lần chạy bộ kiểm thử gần nhất. Các ảnh `screenshots/kiemthu52test.png` và `screenshots/kiemthulaplai.png` là minh chứng kết quả tổng thể và kiểm thử lặp lại.

## 3. Danh sách test case

| Mã | Nhóm kiểm thử | Nội dung | Dữ liệu kiểm thử | Kết quả mong đợi | Kết quả thực tế | Trạng thái | Minh chứng |
|---|---|---|---|---|---|---|---|
| TC-01 | Hợp lệ | Đăng nhập đúng thông tin | Tài khoản hợp lệ | Tạo phiên và trả token | Đăng nhập thành công | PASS | Ảnh tổng thể |
| TC-02 | Không hợp lệ | Đăng nhập thiếu thông tin | Thiếu trường bắt buộc | HTTP 400 | Service trả lỗi 400 | PASS | Ảnh tổng thể |
| TC-03 | Không hợp lệ | Đăng nhập tài khoản không tồn tại | Tài khoản không tồn tại | Từ chối đăng nhập | Service trả lỗi 401 | PASS | Ảnh tổng thể |
| TC-04 | Không hợp lệ | Đăng nhập sai mật khẩu | Mật khẩu sai | Từ chối đăng nhập | Service trả lỗi 401 | PASS | Ảnh tổng thể |
| TC-05 | Bảo mật | Xác thực token hợp lệ | Token hợp lệ | Trả thông tin người dùng | Xác thực thành công | PASS | Ảnh tổng thể |
| TC-06 | Bảo mật | Sử dụng token hết hạn | Token hết hạn | Từ chối xác thực | Trả về null | PASS | Ảnh tổng thể |
| TC-07 | Hợp lệ | Đăng xuất | Phiên đang hoạt động | Xóa phiên đăng nhập | Xóa phiên thành công | PASS | Ảnh tổng thể |
| TC-08 | Không hợp lệ | Tạo phiếu thiếu dữ liệu bắt buộc | Thiếu trường bắt buộc | Từ chối tạo phiếu | Test xác nhận từ chối | PASS | Ảnh tổng thể |
| TC-09 | Không hợp lệ | Nhập mức ưu tiên không hợp lệ | Giá trị ưu tiên sai | Từ chối dữ liệu | Test xác nhận từ chối | PASS | Ảnh tổng thể |
| TC-10 | Biên | Ghi chú đúng 500 ký tự | 500 ký tự | Chấp nhận dữ liệu | Test xác nhận chấp nhận | PASS | Ảnh tổng thể |
| TC-11 | Biên | Ghi chú vượt 500 ký tự | 501 ký tự | Từ chối dữ liệu | Test xác nhận từ chối | PASS | Ảnh tổng thể |
| TC-12 | Hợp lệ | Tính SLA mức CAO | Mức ưu tiên CAO | Tính theo quy tắc SLA | Test xác nhận kết quả | PASS | Ảnh tổng thể |

**Lưu ý về minh chứng:** 12 dòng trên là các trường hợp kiểm thử tiêu biểu được mô tả trong báo cáo. Ảnh tổng thể không thay thế ảnh chụp riêng cho từng test case. Cần bổ sung ảnh riêng nếu giảng viên yêu cầu minh chứng từng trường hợp.

## 4. Kiểm thử theo nhóm

- Kiểm thử dữ liệu hợp lệ: TC-01, TC-05, TC-07.
- Kiểm thử dữ liệu biên: TC-10, TC-11.
- Kiểm thử dữ liệu không hợp lệ: TC-02, TC-03, TC-04, TC-08, TC-09.
- Kiểm thử bảo mật và chất lượng dữ liệu: TC-05, TC-06, TC-07.
- Kiểm thử tính lặp lại: đã chạy `npm test` nhiều lần; lần chạy gần nhất đạt 52 PASS, 0 FAIL.

Minh chứng:
- `screenshots/kiemthu52test.png`
- `screenshots/kiemthulaplai.png`

## 5. Kết luận

Bộ kiểm thử tự động ghi nhận 52 PASS, 0 FAIL tại lần chạy gần nhất ngày 07/11/2026.

Kết quả xác nhận các trường hợp đã được kiểm thử trong phạm vi các unit test hiện có. Chưa thể kết luận toàn bộ API và giao diện đã được kiểm thử tích hợp.

Cần tiếp tục bổ sung kiểm thử tích hợp API và minh chứng riêng cho từng test case để tăng độ bao phủ và đáp ứng đầy đủ yêu cầu kiểm thử.
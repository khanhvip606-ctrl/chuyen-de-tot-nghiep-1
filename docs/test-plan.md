
# TEST PLAN – SMART CRM MEKONG MOBILE

## 1. Mục tiêu kiểm thử

Kiểm tra tính đúng đắn của các chức năng cốt lõi thuộc module tiếp nhận và phân loại yêu cầu bảo hành, tập trung vào đăng nhập, quản lý phiên, tạo và tra cứu phiếu bảo hành, kiểm tra dữ liệu đầu vào và tính SLA.

Mục tiêu là phát hiện lỗi, xác nhận các quy tắc nghiệp vụ và bảo đảm kết quả kiểm thử có thể tái hiện.

## 2. Phạm vi kiểm thử

**Trong phạm vi:**
- Đăng nhập bằng tài khoản hợp lệ và không hợp lệ.
- Xác thực token, đăng xuất và kiểm tra phiên hết hạn.
- Kiểm tra dữ liệu bắt buộc khi tạo phiếu.
- Kiểm tra ID phiếu và lịch sử trạng thái.
- Kiểm tra giới hạn độ dài ghi chú 500 ký tự.
- Kiểm tra mức độ ưu tiên và thời hạn SLA.

**Ngoài phạm vi:**
- Kiểm thử tải và hiệu năng quy mô lớn.
- Kiểm thử bảo mật chuyên sâu.
- Kiểm thử trên nhiều trình duyệt và thiết bị thực tế.

## 3. Phương pháp và môi trường kiểm thử

**Phương pháp:**
- Kiểm thử hộp đen đối với đầu vào hợp lệ, dữ liệu biên và dữ liệu không hợp lệ.
- Kiểm thử bảo mật cơ bản đối với đăng nhập và phiên làm việc.
- Kiểm thử dữ liệu và quy tắc nghiệp vụ SLA.
- Chạy lặp lại bộ kiểm thử để kiểm tra tính ổn định.

**Môi trường:**
- Hệ điều hành: Windows.
- Runtime: Node.js v22.14.0.
- Cơ sở dữ liệu: SQLite, better-sqlite3.
- Framework kiểm thử: Node.js Test Runner.
- Lệnh chạy: `npm test`.

Các bài kiểm thử sử dụng database tạm để hạn chế ảnh hưởng đến dữ liệu chính của ứng dụng.

## 4. Tiêu chí đánh giá và minh chứng

- Mỗi test case phải có mã định danh, dữ liệu đầu vào, kết quả mong đợi và kết quả thực tế.
- Ghi nhận PASS hoặc FAIL theo kết quả chạy thực tế.
- Lưu ảnh minh chứng trong `docs/screenshots/`, đặt tên theo mã test case.
- Lỗi phát hiện phải được ghi nhận, phân loại mức độ nghiêm trọng, xác định nguyên nhân và kiểm tra lại sau khi sửa.
- Tiêu chí hoàn thành: các test case trong phạm vi được thực hiện, kết quả và minh chứng được ghi nhận trung thực; toàn bộ bộ test tự động chạy bằng một lệnh `npm test`.

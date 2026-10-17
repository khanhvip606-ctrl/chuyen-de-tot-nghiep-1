# Smart CRM – Mekong Mobile

## 1. Mục tiêu

Đề tài tập trung phân tích và từng bước triển khai **Luồng L2 – Tiếp nhận và phân loại yêu cầu bảo hành** trong hệ thống Smart CRM của Mekong Mobile.

Mục tiêu là chuyển đổi yêu cầu nghiệp vụ thành các tài liệu phân tích, thiết kế và mã nguồn có thể kiểm thử.

Phạm vi chính gồm:

- Tra cứu thông tin khách hàng.
- Tạo hồ sơ khách hàng.
- Ghi nhận thông tin thiết bị.
- Kiểm tra tình trạng bảo hành.
- Ghi nhận mô tả lỗi và nhóm sự cố.
- Xác định mức độ ưu tiên.
- Xác định hạn cam kết xử lý.

## 2. Yêu cầu môi trường

- Windows 10/11.
- Node.js và npm.
- Git.
- Notepad hoặc Visual Studio Code.
- draw.io Desktop hoặc draw.io trên trình duyệt để chỉnh sửa sơ đồ.
- Postman hoặc công cụ tương đương để kiểm thử API.

Các thư viện Node.js được khai báo trong `package.json`.

### Cài đặt và chạy dự án

Cài đặt thư viện:

```bash
npm install
```

Khởi chạy ứng dụng:

```bash
npm start
```

Chạy chế độ phát triển:

```bash
npm run dev
```

Chạy kiểm thử tự động:

```bash
npm test
```

Ứng dụng mặc định sử dụng cổng 3000. Có thể cấu hình cổng thông qua biến môi trường `PORT`.

## 3. Cấu trúc thư mục

```text
chuyen-de-tot-nghiep-1/
├── anhchungminh/
├── data/
├── diagrams/
├── docs/
│   ├── ai-disclosure.md
│   ├── api-contract.md
│   ├── database.sql
│   ├── srs.md
│   └── thay-doi-thiet-ke.md
├── src/
│   ├── app.js
│   ├── database/
│   ├── middlewares/
│   ├── repositories/
│   ├── routes/
│   └── services/
├── tests/
│   └── ticketService.test.js
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

Thư mục `data/` lưu cơ sở dữ liệu SQLite trên máy phát triển. File cơ sở dữ liệu và các file tạm không được đưa lên GitHub.

## 4. Công nghệ sử dụng

- **Node.js:** môi trường thực thi JavaScript phía máy chủ.
- **Express:** xây dựng REST API.
- **SQLite:** lưu trữ dữ liệu quan hệ.
- **better-sqlite3:** kết nối và thao tác với SQLite.
- **Node.js Test Runner:** chạy unit test bằng `node:test` và `node:assert/strict`.
- **Git/GitHub:** quản lý mã nguồn và lịch sử thay đổi.

## 5. Phạm vi nghiệp vụ

Luồng L2 tập trung vào việc tiếp nhận và phân loại yêu cầu bảo hành.

Các chức năng chính:

- Tra cứu và tạo hồ sơ khách hàng.
- Ghi nhận thiết bị và thông tin liên quan.
- Kiểm tra dữ liệu đầu vào của yêu cầu bảo hành.
- Ghi nhận mô tả lỗi và nhóm sự cố.
- Phân loại mức độ ưu tiên.
- Tính hạn xử lý theo mức độ ưu tiên.

Các chức năng quản lý kho, sửa chữa chi tiết, khảo sát hài lòng và thanh toán không thuộc phạm vi triển khai chính của luồng L2 trong giai đoạn này.

## 6. Trạng thái hiện tại – Buổi 08

- Đã có cấu trúc backend gồm `routes/`, `services/` và `repositories/`.
- Đã xây dựng các module xử lý khách hàng, thiết bị và yêu cầu bảo hành.
- Đã bổ sung unit test cho nghiệp vụ tạo yêu cầu bảo hành.
- Đã chạy `npm test` thành công với **2 test PASS, 0 test FAIL**.
- Đã cập nhật `.gitignore` để loại trừ cơ sở dữ liệu SQLite và các file môi trường cục bộ.
- Đã có file `.env.example` làm mẫu cấu hình.
- Đã có tài liệu `docs/thay-doi-thiet-ke.md` ghi nhận các quyết định điều chỉnh thiết kế.

Các công việc tiếp theo là tiếp tục kiểm tra migration và seed dữ liệu, hoàn thiện CRUD qua ba lớp, kiểm thử API bằng Postman hoặc curl, bổ sung ảnh minh chứng và cập nhật tài liệu theo kết quả triển khai thực tế.

## 7. Tài liệu tham khảo trong repository

| Tài liệu | Nội dung |
|---|---|
| `docs/srs.md` | Đặc tả yêu cầu phần mềm |
| `docs/api-contract.md` | Đặc tả API |
| `docs/database.sql` | Thiết kế cơ sở dữ liệu |
| `docs/thay-doi-thiet-ke.md` | Ghi nhận thay đổi thiết kế |
| `docs/ai-disclosure.md` | Công khai việc sử dụng AI |
| `diagrams/` | Các sơ đồ phân tích và thiết kế |


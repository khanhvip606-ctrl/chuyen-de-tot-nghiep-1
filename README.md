# Smart CRM – Mekong Mobile

## 1. Mục tiêu

Đề tài tập trung phân tích và triển khai **Luồng L2 – Tiếp nhận và phân loại yêu cầu bảo hành** trong hệ thống Smart CRM của Mekong Mobile.

Mục tiêu là chuyển đổi yêu cầu nghiệp vụ thành tài liệu phân tích, thiết kế và ứng dụng có thể kiểm thử.

Phạm vi chính gồm:

- Tra cứu và tạo hồ sơ khách hàng.
- Ghi nhận thông tin thiết bị.
- Kiểm tra tình trạng bảo hành.
- Ghi nhận mô tả lỗi và nhóm sự cố.
- Xác định mức độ ưu tiên.
- Tính hạn cam kết xử lý.
- Theo dõi trạng thái và lịch sử xử lý phiếu bảo hành.

## 2. Công nghệ sử dụng

### Backend
- Node.js.
- Express.
- SQLite.
- better-sqlite3.
- Node.js Test Runner (`node:test`).

### Frontend
- React.
- Vite.
- JavaScript.
- CSS.

### Công cụ
- Git/GitHub.
- Postman hoặc công cụ tương đương.
- draw.io.

## 3. Yêu cầu môi trường

- Windows 10/11.
- Node.js và npm.
- Git.
- Trình duyệt web hiện đại.

## 4. Cài đặt và chạy dự án

### 4.1. Tải mã nguồn

```bash
git clone https://github.com/khanhvip606-ctrl/chuyen-de-tot-nghiep-1.git
cd chuyen-de-tot-nghiep-1
```

### 4.2. Cấu hình Backend

Tạo file `.env` từ `.env.example`, sau đó cập nhật các biến môi trường phù hợp.

Không đưa file `.env` chứa mật khẩu thật lên GitHub.

Cài đặt thư viện:

```bash
npm install
```

Khởi tạo cơ sở dữ liệu:

```bash
npm run migrate
```

Tạo dữ liệu mẫu:

```bash
npm run seed
```

Khởi chạy Backend:

```bash
npm start
```

Backend mặc định chạy tại:

```text
http://localhost:3000
```

### 4.3. Chạy Frontend

Mở một cửa sổ terminal khác:

```bash
cd client
npm install
npm run dev
```

Mở địa chỉ Frontend do Vite hiển thị, thông thường là:

```text
http://localhost:5173/
```

### 4.4. Chạy kiểm thử

Tại thư mục gốc dự án:

```bash
npm test
```

## 5. Cấu trúc thư mục

```text
chuyen-de-tot-nghiep-1/
├── anhchungminh/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   ├── Login.jsx
│   │   ├── App.css
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
├── data/
├── diagrams/
├── docs/
│   ├── ai-disclosure.md
│   ├── api-contract.md
│   ├── database.sql
│   ├── srs.md
│   └── thay-doi-thiet-ke.md
├── src/
│   ├── database/
│   ├── middlewares/
│   ├── repositories/
│   ├── routes/
│   ├── services/
│   └── app.js
├── tests/
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

Thư mục `data/` lưu cơ sở dữ liệu SQLite trên máy phát triển. File `.env` và các dữ liệu nhạy cảm không được đưa lên GitHub.

## 6. Phạm vi nghiệp vụ

Luồng L2 tập trung vào việc tiếp nhận và phân loại yêu cầu bảo hành.

Các chức năng chính:

- Tra cứu và tạo hồ sơ khách hàng.
- Ghi nhận thiết bị và thông tin liên quan.
- Kiểm tra dữ liệu đầu vào.
- Ghi nhận mô tả lỗi và nhóm sự cố.
- Phân loại mức độ ưu tiên.
- Tính hạn xử lý theo mức độ ưu tiên.
- Cập nhật trạng thái phiếu.
- Lưu lịch sử thay đổi trạng thái.

Các chức năng quản lý kho, sửa chữa chi tiết, khảo sát hài lòng và thanh toán không thuộc phạm vi triển khai chính của luồng L2 trong giai đoạn này.

## 7. Trạng thái triển khai hiện tại – Sprint 2

### 7.1. Backend và cơ sở dữ liệu

- Xây dựng Backend bằng Node.js và Express theo mô hình `routes/`, `services/`, `repositories/`.
- Triển khai các API tiếp nhận phiếu bảo hành.
- Kiểm tra dữ liệu đầu vào.
- Cập nhật trạng thái phiếu và truy xuất lịch sử trạng thái.
- Sử dụng SQLite để lưu trữ dữ liệu.
- Bổ sung migration và seed dữ liệu mẫu.
- Bổ sung xác thực đăng nhập và quản lý phiên đăng nhập.

### 7.2. Frontend

- Xây dựng giao diện bằng React và Vite.
- Bổ sung màn hình đăng nhập.
- Xây dựng giao diện tổng quan.
- Xây dựng màn hình danh sách phiếu bảo hành.
- Xây dựng màn hình chi tiết và tiếp nhận yêu cầu.
- Tách các module gọi API trong thư mục `client/src/api/`.
- Kết nối giao diện với Backend.
- Bổ sung trạng thái tải dữ liệu, dữ liệu trống, lỗi và thử lại.

### 7.3. Kiểm thử

- Kiểm thử API tạo phiếu bảo hành.
- Kiểm tra trường hợp dữ liệu đầu vào không hợp lệ.
- Kiểm tra cập nhật trạng thái phiếu.
- Kiểm tra truy xuất lịch sử trạng thái.
- Bổ sung 5 unit tests cho `ticketService`.

Kết quả kiểm thử gần nhất được ghi nhận: **5 tests PASS, 0 tests FAIL**.

### 7.4. Tài liệu và minh chứng

- Lưu ảnh minh chứng trong `anhchungminh/`.
- Lưu đặc tả yêu cầu trong `docs/srs.md`.
- Lưu hợp đồng API trong `docs/api-contract.md`.
- Lưu thiết kế cơ sở dữ liệu trong `docs/database.sql`.
- Ghi nhận thay đổi thiết kế trong `docs/thay-doi-thiet-ke.md`.
- Công khai việc sử dụng AI trong `docs/ai-disclosure.md`.

## 8. Công việc tiếp tục rà soát

- Đối chiếu các yêu cầu Sprint 2 với chức năng đã triển khai.
- Rà soát CRUD và các trường hợp biên.
- Kiểm tra quy trình đăng nhập và đăng xuất.
- Kiểm tra các trạng thái tải, rỗng và lỗi của giao diện.
- Hoàn thiện tài liệu và minh chứng theo kết quả kiểm thử thực tế.

## 9. Tài liệu trong repository

| Tài liệu | Nội dung |
|---|---|
| `docs/srs.md` | Đặc tả yêu cầu phần mềm |
| `docs/api-contract.md` | Đặc tả API |
| `docs/database.sql` | Thiết kế cơ sở dữ liệu |
| `docs/thay-doi-thiet-ke.md` | Ghi nhận thay đổi thiết kế |
| `docs/ai-disclosure.md` | Công khai việc sử dụng AI |
| `diagrams/` | Sơ đồ phân tích và thiết kế |
| `anhchungminh/` | Ảnh minh chứng quá trình phát triển và kiểm thử |

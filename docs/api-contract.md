# API Contract

## 1. Mục đích

API Contract mô tả các API phục vụ luồng L2 – Tiếp nhận và phân loại yêu cầu bảo hành của hệ thống Smart CRM – Mekong Mobile.

Các API được đề xuất để hỗ trợ các chức năng chính gồm tra cứu khách hàng, tạo hồ sơ khách hàng, tra cứu thiết bị và tạo yêu cầu bảo hành.

> Lưu ý: Các endpoint trong tài liệu này là API Contract đề xuất cho Track SE dựa trên yêu cầu của luồng L2. Đây là đặc tả giao diện API, không khẳng định hệ thống thực tế đã triển khai các endpoint này.

---

## 2. Danh sách Endpoint

| Method | Endpoint                             | Mục đích                              | Actor               |
| ------ | ------------------------------------ | ------------------------------------- | ------------------- |
| GET    | `/api/customers?phone={phone}`       | Tra cứu khách hàng theo số điện thoại | Nhân viên tiếp nhận |
| POST   | `/api/customers`                     | Tạo hồ sơ khách hàng mới              | Nhân viên tiếp nhận |
| GET    | `/api/devices?serial_no={serial_no}` | Tra cứu thiết bị theo Serial/IMEI     | Nhân viên tiếp nhận |
| POST   | `/api/tickets`                       | Tạo yêu cầu bảo hành                  | Nhân viên tiếp nhận |

---

## 3. API 1 – Tra cứu khách hàng

### Request

```http
GET /api/customers?phone=0901234567
```

### Query Parameters

| Field | Type   | Required | Validation                                    |
| ----- | ------ | -------- | --------------------------------------------- |
| phone | string | Yes      | Không được rỗng; phải là số điện thoại hợp lệ |

### Response – Thành công

```json
{
  "customer_id": "CUS001",
  "customer_name": "Nguyễn Văn A",
  "phone": "0901234567"
}
```

### Response – Không tìm thấy

```json
{
  "message": "Customer not found"
}
```

### HTTP Status

| Status | Ý nghĩa                    |
| ------ | -------------------------- |
| 200    | Tra cứu thành công         |
| 400    | Số điện thoại không hợp lệ |
| 404    | Không tìm thấy khách hàng  |
| 500    | Lỗi hệ thống               |

---

## 4. API 2 – Tạo hồ sơ khách hàng

### Request

```http
POST /api/customers
Content-Type: application/json
```

```json
{
  "customer_name": "Nguyễn Văn A",
  "phone": "0901234567"
}
```

### Validation

| Field         | Type   | Required | Validation                                                                 |
| ------------- | ------ | -------- | -------------------------------------------------------------------------- |
| customer_name | string | Yes      | Không được rỗng                                                            |
| phone         | string | Yes      | Không được rỗng; phải là số điện thoại hợp lệ; không được trùng khách hàng |

### Response – Thành công

```json
{
  "customer_id": "CUS001",
  "customer_name": "Nguyễn Văn A",
  "phone": "0901234567"
}
```

### HTTP Status

| Status | Ý nghĩa                      |
| ------ | ---------------------------- |
| 201    | Tạo khách hàng thành công    |
| 400    | Dữ liệu đầu vào không hợp lệ |
| 409    | Số điện thoại đã tồn tại     |
| 500    | Lỗi hệ thống                 |

---

## 5. API 3 – Tra cứu thiết bị

### Request

```http
GET /api/devices?serial_no=IMEI123456789
```

### Query Parameters

| Field     | Type   | Required | Validation                                 |
| --------- | ------ | -------- | ------------------------------------------ |
| serial_no | string | Yes      | Không được rỗng; dùng để xác định thiết bị |

### Response – Thành công

```json
{
  "device_id": "DEV001",
  "serial_no": "IMEI123456789",
  "customer_id": "CUS001",
  "purchase_date": "2026-01-15"
}
```

### Response – Không tìm thấy

```json
{
  "message": "Device not found"
}
```

### HTTP Status

| Status | Ý nghĩa                     |
| ------ | --------------------------- |
| 200    | Tra cứu thiết bị thành công |
| 400    | Serial/IMEI không hợp lệ    |
| 404    | Không tìm thấy thiết bị     |
| 500    | Lỗi hệ thống                |

---

## 6. API 4 – Tạo yêu cầu bảo hành

### Request

```http
POST /api/tickets
Content-Type: application/json
```

```json
{
  "customer_id": "CUS001",
  "device_id": "DEV001",
  "issue_description": "Thiết bị không lên nguồn",
  "issue_category": "POWER",
  "priority": "CAO"
}
```

### Validation

| Field             | Type   | Required | Validation                                 |
| ----------------- | ------ | -------- | ------------------------------------------ |
| customer_id       | string | Yes      | Phải tồn tại trong hệ thống                |
| device_id         | string | Yes      | Phải tồn tại và thuộc khách hàng           |
| issue_description | string | Yes      | Không được rỗng                            |
| issue_category    | string | Yes      | Phải thuộc nhóm sự cố được hệ thống hỗ trợ |
| priority          | string | Yes      | Chỉ nhận `CAO`, `TRUNG_BINH`, `THAP`       |

### Response – Thành công

```json
{
  "ticket_id": "TIC001",
  "customer_id": "CUS001",
  "device_id": "DEV001",
  "issue_category": "POWER",
  "priority": "CAO",
  "status": "MỚI",
  "commitment_deadline": "2026-10-07T17:00:00"
}
```

### HTTP Status

| Status | Ý nghĩa                                           |
| ------ | ------------------------------------------------- |
| 201    | Tạo yêu cầu bảo hành thành công                   |
| 400    | Dữ liệu đầu vào không hợp lệ                      |
| 404    | Không tìm thấy khách hàng hoặc thiết bị           |
| 409    | Thiết bị không hợp lệ hoặc không thuộc khách hàng |
| 500    | Lỗi hệ thống                                      |

---

## 7. Quy tắc xử lý

### 7.1. Số điện thoại

Số điện thoại phải được chuẩn hóa trước khi lưu và tra cứu. Số điện thoại của khách hàng là duy nhất.

### 7.2. Thiết bị

Thiết bị được xác định bằng Serial/IMEI. Một thiết bị chỉ thuộc về một khách hàng tại một thời điểm.

### 7.3. Mức ưu tiên

Hệ thống sử dụng ba mức ưu tiên:

* `CAO`
* `TRUNG_BINH`
* `THAP`

### 7.4. Hạn cam kết

Hạn cam kết được xác định dựa trên mức độ ưu tiên:

| Mức ưu tiên | Hạn cam kết |
| ----------- | ----------- |
| CAO         | 24 giờ      |
| TRUNG_BINH  | 72 giờ      |
| THAP        | 120 giờ     |

Ngày làm việc được tính từ thứ Hai đến thứ Bảy.

### 7.5. Không có ngày mua

Nếu không có ngày mua, tình trạng bảo hành được đánh dấu là chưa xác minh và cần quản lý trung tâm kiểm tra/phê duyệt.

### 7.6. Lịch sử trạng thái

Các thay đổi trạng thái của yêu cầu bảo hành phải được ghi nhận trong `ticket_status_log`.

---

## 8. Tổng hợp HTTP Status Code

| Status | Ý nghĩa                      |
| ------ | ---------------------------- |
| 200    | Request thành công           |
| 201    | Tạo tài nguyên thành công    |
| 400    | Dữ liệu đầu vào không hợp lệ |
| 404    | Không tìm thấy tài nguyên    |
| 409    | Dữ liệu bị xung đột          |
| 500    | Lỗi hệ thống                 |

---

## 9. Traceability

| API                   | User Story             | Use Case               | Functional Requirement |
| --------------------- | ---------------------- | ---------------------- | ---------------------- |
| GET `/api/customers`  | US01                   | UC01                   | FR01                   |
| POST `/api/customers` | US02                   | UC02                   | FR02                   |
| GET `/api/devices`    | US03                   | UC03                   | FR03                   |
| POST `/api/tickets`   | US05, US06, US07, US08 | UC05, UC06, UC07, UC08 | FR05, FR06, FR07, FR08 |

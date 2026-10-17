# API Contract

## 1. Mục đích

API Contract mô tả các API đề xuất phục vụ luồng L2 – Tiếp nhận và phân loại yêu cầu bảo hành trong hệ thống Smart CRM – Mekong Mobile.

Các API hỗ trợ tra cứu và tạo khách hàng, tra cứu thiết bị, kiểm tra tình trạng bảo hành và tạo phiếu yêu cầu bảo hành. Đây là đặc tả ở mức thiết kế, không khẳng định các endpoint đã được triển khai thực tế.

## 2. Danh sách Endpoint

| Method | Endpoint | Mục đích | Actor |
|---|---|---|---|
| GET | `/api/customers?phone={phone}` | Tra cứu khách hàng | Nhân viên tiếp nhận |
| POST | `/api/customers` | Tạo khách hàng | Nhân viên tiếp nhận |
| GET | `/api/devices?serial_number={serial_number}` | Tra cứu thiết bị | Nhân viên tiếp nhận |
| GET | `/api/devices/{device_id}/warranty` | Kiểm tra tình trạng bảo hành | Nhân viên tiếp nhận |
| POST | `/api/tickets` | Tạo phiếu yêu cầu bảo hành | Nhân viên tiếp nhận |

## 3. API tra cứu khách hàng

**Request**

`GET /api/customers?phone=0901234567`

**Query Parameters**

| Field | Type | Required | Validation |
|---|---|---|---|
| phone | string | Yes | Số điện thoại hợp lệ, được chuẩn hóa trước khi tra cứu |

**Response thành công**

```json
{
  "customer_id": 1,
  "customer_name": "Nguyễn Văn A",
  "phone": "0901234567"
}
```

**HTTP Status**

| Status | Ý nghĩa |
|---|---|
| 200 | Tra cứu thành công |
| 400 | Số điện thoại không hợp lệ |
| 404 | Không tìm thấy khách hàng |
| 500 | Lỗi hệ thống |

## 4. API tạo khách hàng

**Request**

`POST /api/customers`

```json
{
  "customer_name": "Nguyễn Văn A",
  "phone": "0901234567"
}
```

**Validation**

| Field | Type | Required | Validation |
|---|---|---|---|
| customer_name | string | Yes | Không được rỗng |
| phone | string | Yes | Đúng 10 chữ số, bắt đầu bằng 0 và không trùng |

**Response thành công**

```json
{
  "customer_id": 1,
  "customer_name": "Nguyễn Văn A",
  "phone": "0901234567"
}
```

**HTTP Status**

| Status | Ý nghĩa |
|---|---|
| 201 | Tạo khách hàng thành công |
| 400 | Dữ liệu không hợp lệ |
| 409 | Số điện thoại đã tồn tại |
| 500 | Lỗi hệ thống |

## 5. API tra cứu thiết bị

**Request**

`GET /api/devices?serial_number=IMEI123456789`

**Query Parameters**

| Field | Type | Required | Validation |
|---|---|---|---|
| serial_number | string | Yes | Không được rỗng; dùng để xác định thiết bị |

**Response thành công**

```json
{
  "device_id": 1,
  "serial_number": "IMEI123456789",
  "customer_id": 1,
  "purchase_date": "2026-01-15",
  "warranty_expiry": "2027-01-15"
}
```

**HTTP Status**

| Status | Ý nghĩa |
|---|---|
| 200 | Tra cứu thành công |
| 400 | Serial/IMEI không hợp lệ |
| 404 | Không tìm thấy thiết bị |
| 500 | Lỗi hệ thống |

## 6. API kiểm tra tình trạng bảo hành

**Request**

`GET /api/devices/1/warranty`

**Response khi có đủ dữ liệu**

```json
{
  "device_id": 1,
  "warranty_status": "CON_BAO_HANH",
  "purchase_date": "2026-01-15",
  "warranty_expiry": "2027-01-15",
  "verification_required": false
}
```

**Response khi thiếu dữ liệu**

```json
{
  "device_id": 1,
  "warranty_status": "CHUA_XAC_MINH",
  "verification_required": true,
  "message": "Cần quản lý trung tâm xác minh thông tin bảo hành"
}
```

**Quy tắc:** Nếu thiếu ngày mua hoặc thông tin cần thiết để xác định thời hạn bảo hành, hệ thống không tự kết luận còn hoặc hết bảo hành. Trường hợp này phải được đánh dấu chưa xác minh.

## 7. API tạo phiếu yêu cầu bảo hành

**Request**

`POST /api/tickets`

```json
{
  "customer_id": 1,
  "device_id": 1,
  "issue_description": "Thiết bị không lên nguồn",
  "issue_category": "POWER",
  "priority": "CAO"
}
```

**Validation**

| Field | Type | Required | Validation |
|---|---|---|---|
| customer_id | integer | Yes | Khách hàng phải tồn tại |
| device_id | integer | Yes | Thiết bị phải tồn tại và thuộc khách hàng đã chọn |
| issue_description | string | Yes | Không được rỗng |
| issue_category | string | Yes | Thuộc danh mục nhóm sự cố hợp lệ |
| priority | string | Yes | Chỉ nhận `CAO`, `TRUNG_BINH`, `THAP` |

**Response thành công**

```json
{
  "ticket_id": 1,
  "ticket_code": "TIC001",
  "customer_id": 1,
  "device_id": 1,
  "issue_category": "POWER",
  "priority": "CAO",
  "status": "MOI",
  "sla_due_at": "2026-10-07T17:00:00"
}
```

Thời gian trong ví dụ chỉ minh họa định dạng phản hồi, không phải thời hạn SLA được tính cho một yêu cầu thực tế.

**HTTP Status**

| Status | Ý nghĩa |
|---|---|
| 201 | Tạo phiếu thành công |
| 400 | Dữ liệu đầu vào không hợp lệ |
| 404 | Không tìm thấy khách hàng hoặc thiết bị |
| 409 | Thiết bị không thuộc khách hàng đã chọn hoặc xảy ra xung đột dữ liệu |
| 500 | Lỗi hệ thống |

Khi tạo phiếu, hệ thống phải kiểm tra tính hợp lệ của khách hàng và thiết bị, tạo mã phiếu duy nhất, tính SLA theo mức ưu tiên và ghi nhận trạng thái ban đầu.

## 8. Quy tắc xử lý

### 8.1. Số điện thoại

Số điện thoại phải được chuẩn hóa trước khi lưu và tra cứu. Số điện thoại khách hàng là duy nhất và phải đáp ứng định dạng 10 chữ số bắt đầu bằng 0.

### 8.2. Thiết bị

Thiết bị được xác định bằng serial hoặc IMEI. Một thiết bị chỉ thuộc về một khách hàng tại một thời điểm. Khi tạo phiếu, `customer_id` phải khớp với khách hàng đang sở hữu thiết bị.

### 8.3. Mức ưu tiên và SLA

| Mức ưu tiên | Thời lượng SLA |
|---|---:|
| CAO | 24 giờ làm việc |
| TRUNG_BINH | 72 giờ làm việc |
| THAP | 120 giờ làm việc |

Thời lượng được tính theo lịch làm việc từ thứ Hai đến thứ Bảy. Giờ bắt đầu, giờ kết thúc và ngày nghỉ cần được xác định theo chính sách của doanh nghiệp. Hệ thống lưu thời hạn vào trường `sla_due_at`.

### 8.4. Tình trạng bảo hành

Nếu thiếu ngày mua hoặc dữ liệu cần thiết để xác định thời hạn bảo hành, hệ thống đánh dấu `CHUA_XAC_MINH` và yêu cầu quản lý trung tâm xem xét.

### 8.5. Lịch sử trạng thái

Các lần thay đổi trạng thái phiếu phải được ghi nhận trong `ticket_status_log`, bao gồm trạng thái trước, trạng thái sau, thời điểm thay đổi và người thực hiện khi có thông tin.

## 9. Tổng hợp HTTP Status Code

| Status | Ý nghĩa |
|---|---|
| 200 | Request thành công |
| 201 | Tạo tài nguyên thành công |
| 400 | Dữ liệu đầu vào không hợp lệ |
| 404 | Không tìm thấy tài nguyên |
| 409 | Dữ liệu bị xung đột |
| 500 | Lỗi hệ thống |

## 10. Traceability

| API | User Story | Use Case | Functional Requirement |
|---|---|---|---|
| GET `/api/customers` | US01 | UC01 | FR01 |
| POST `/api/customers` | US02 | UC02 | FR02 |
| GET `/api/devices` | US03 | UC03 | FR03 |
| GET `/api/devices/{device_id}/warranty` | US04 | UC04 | FR04 |
| POST `/api/tickets` | US05, US06, US07 | UC05, UC06, UC07, UC08 | FR05, FR06, FR07, FR08 |

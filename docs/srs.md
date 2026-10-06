# SRS RÚT GỌN – SMART CRM MEKONG MOBILE

## 1. Tổng quan

### 1.1. Phạm vi

Đề tài tập trung vào **Luồng L2 – Tiếp nhận và phân loại yêu cầu bảo hành** trong hệ thống Smart CRM của Mekong Mobile.

Trong phạm vi này, em tập trung phân tích quá trình nhân viên tiếp nhận yêu cầu bảo hành từ khách hàng. Quy trình gồm các bước chính như tra cứu thông tin khách hàng, ghi nhận thiết bị, kiểm tra tình trạng bảo hành, ghi nhận lỗi, phân loại sự cố, xác định mức độ ưu tiên và xác định hạn cam kết xử lý.

### 1.2. Người dùng chính

* **Nhân viên tiếp nhận:** là người trực tiếp tiếp nhận yêu cầu bảo hành, tra cứu khách hàng, ghi nhận thiết bị và nhập các thông tin liên quan đến yêu cầu.
* **Quản lý trung tâm:** hỗ trợ xác minh các trường hợp bảo hành chưa đầy đủ thông tin hoặc cần được kiểm tra và phê duyệt.

### 1.3. Các thực thể liên quan

Trong quá trình phân tích, em xác định một số thực thể chính gồm:

* `customer`: thông tin khách hàng.
* `device`: thông tin thiết bị.
* `ticket`: phiếu bảo hành.
* `issue_category`: nhóm sự cố.
* `ticket_status_log`: lịch sử thay đổi trạng thái của phiếu.

### 1.4. Bảng thuật ngữ

| Thuật ngữ | Giải thích |
|---|---|
| CRM | Customer Relationship Management – hệ thống quản lý quan hệ khách hàng |
| Ticket | Phiếu/yêu cầu bảo hành được tạo khi khách hàng yêu cầu hỗ trợ |
| Serial/IMEI | Mã định danh của thiết bị |
| Issue Category | Nhóm sự cố dùng để phân loại yêu cầu bảo hành |
| Priority | Mức độ ưu tiên xử lý yêu cầu bảo hành |
| SLA | Thời hạn cam kết xử lý yêu cầu |
| GWT | Given – When – Then, dùng để mô tả tiêu chí chấp nhận |
| MoSCoW | Phương pháp phân loại mức độ ưu tiên yêu cầu: MUST, SHOULD, COULD, WON'T |
---

## 2. User Story

### US01 – Tra cứu khách hàng

**MoSCoW: MUST**

**User Story:**

> Là nhân viên tiếp nhận, em muốn tra cứu khách hàng bằng số điện thoại để xác định đúng hồ sơ khách hàng trước khi tiếp nhận yêu cầu bảo hành.

**Tiêu chí chấp nhận:**

* **GWT01:** Given em nhập số điện thoại hợp lệ, When em thực hiện tra cứu, Then hệ thống hiển thị hồ sơ khách hàng tương ứng.
* **GWT02:** Given số điện thoại chưa tồn tại, When em thực hiện tra cứu, Then hệ thống thông báo không tìm thấy hồ sơ và cho phép tạo hồ sơ khách hàng mới.
* **GWT03 – Ngoại lệ:** Given số điện thoại đã tồn tại, When em nhập lại số điện thoại đó, Then hệ thống hiển thị hồ sơ có sẵn và không tạo hồ sơ trùng.

### US02 – Tạo hồ sơ khách hàng

**MoSCoW: MUST**

**User Story:**

> Là nhân viên tiếp nhận, em muốn tạo hồ sơ khách hàng mới khi chưa tìm thấy thông tin khách hàng để có đầy đủ dữ liệu phục vụ quá trình tiếp nhận bảo hành.

**Tiêu chí chấp nhận:**

* **GWT04:** Given số điện thoại chưa tồn tại, When em nhập đầy đủ thông tin hợp lệ, Then hệ thống tạo hồ sơ khách hàng mới.
* **GWT05:** Given số điện thoại được nhập ở nhiều định dạng, When hệ thống lưu thông tin, Then số điện thoại được chuẩn hóa về định dạng quy định.
* **GWT06 – Ngoại lệ:** Given số điện thoại đã tồn tại, When em cố tạo hồ sơ mới, Then hệ thống không tạo bản ghi trùng và thông báo hồ sơ đã tồn tại.

### US03 – Ghi nhận thiết bị

**MoSCoW: MUST**

**User Story:**

> Là nhân viên tiếp nhận, em muốn ghi nhận thiết bị bằng số serial hoặc IMEI để xác định chính xác thiết bị của khách hàng.

**Tiêu chí chấp nhận:**

* **GWT07:** Given em nhập serial hoặc IMEI hợp lệ, When hệ thống kiểm tra, Then hệ thống xác định được thiết bị.
* **GWT08:** Given thiết bị thuộc về khách hàng đang được tra cứu, When em ghi nhận thiết bị, Then hệ thống liên kết thiết bị với khách hàng.
* **GWT09 – Ngoại lệ:** Given thiết bị đã thuộc về khách hàng khác, When em ghi nhận thiết bị, Then hệ thống không cho phép liên kết sai.

### US04 – Kiểm tra tình trạng bảo hành

**MoSCoW: MUST**

**User Story:**

> Là nhân viên tiếp nhận, em muốn kiểm tra tình trạng bảo hành của thiết bị để xác định thông tin bảo hành trước khi tiếp nhận yêu cầu.

**Tiêu chí chấp nhận:**

* **GWT10:** Given thiết bị có đầy đủ thông tin ngày mua, When hệ thống kiểm tra bảo hành, Then hệ thống xác định tình trạng bảo hành.
* **GWT11:** Given thiết bị chưa có ngày mua, When em tiếp nhận yêu cầu, Then hệ thống đánh dấu trường hợp chưa xác minh bảo hành.
* **GWT12 – Ngoại lệ:** Given trường hợp chưa xác minh bảo hành, When cần tiếp tục xử lý, Then trường hợp đó được chuyển cho quản lý trung tâm xác minh.

### US05 – Ghi nhận mô tả lỗi

**MoSCoW: MUST**

**User Story:**

> Là nhân viên tiếp nhận, em muốn ghi nhận mô tả lỗi do khách hàng cung cấp để lưu lại nội dung yêu cầu bảo hành.

**Tiêu chí chấp nhận:**

* **GWT13:** Given khách hàng cung cấp thông tin lỗi, When em nhập mô tả lỗi, Then hệ thống lưu thông tin vào phiếu.
* **GWT14:** Given mô tả lỗi đã được nhập, When em kiểm tra phiếu, Then nội dung mô tả được hiển thị đầy đủ.
* **GWT15:** Given em chưa nhập mô tả lỗi, When em cố hoàn tất bước tiếp nhận, Then hệ thống yêu cầu bổ sung thông tin.

### US06 – Phân loại nhóm sự cố

**MoSCoW: MUST**

**User Story:**

> Là nhân viên tiếp nhận, em muốn phân loại yêu cầu vào nhóm sự cố phù hợp để thông tin bảo hành được thống nhất và thuận tiện cho việc xử lý.

**Tiêu chí chấp nhận:**

* **GWT16:** Given mô tả lỗi đã được ghi nhận, When em chọn nhóm sự cố, Then hệ thống lưu nhóm sự cố cho phiếu.
* **GWT17:** Given nhóm sự cố hợp lệ, When em xác nhận phân loại, Then hệ thống ghi nhận nhóm sự cố tương ứng.
* **GWT18:** Given em chưa chọn nhóm sự cố, When em hoàn tất bước phân loại, Then hệ thống yêu cầu chọn nhóm sự cố.

### US07 – Xác định mức ưu tiên

**MoSCoW: SHOULD**

**User Story:**

> Là nhân viên tiếp nhận, em muốn xác định mức ưu tiên cho phiếu bảo hành để hệ thống có cơ sở xác định thời hạn xử lý.

**Tiêu chí chấp nhận:**

* **GWT19:** Given phiếu đã được tiếp nhận, When em xác định mức ưu tiên, Then hệ thống lưu một trong các mức ưu tiên hợp lệ.
* **GWT20:** Given mức ưu tiên đã được xác định, When hệ thống sinh hạn cam kết, Then thời hạn được tính theo mức ưu tiên.
* **GWT21:** Given mức ưu tiên không hợp lệ, When em xác nhận, Then hệ thống thông báo dữ liệu không hợp lệ.

### US08 – Sinh hạn cam kết

**MoSCoW: MUST**

**User Story:**

> Là nhân viên tiếp nhận, em muốn hệ thống tự động sinh hạn cam kết theo mức ưu tiên để hạn chế việc tính toán thủ công.

**Tiêu chí chấp nhận:**

* **GWT22:** Given mức ưu tiên là CAO, When hệ thống sinh hạn cam kết, Then hệ thống áp dụng thời hạn theo quy tắc nghiệp vụ.
* **GWT23:** Given mức ưu tiên là TRUNG_BINH, When hệ thống sinh hạn cam kết, Then hệ thống áp dụng thời hạn theo quy tắc nghiệp vụ.
* **GWT24:** Given mức ưu tiên là THAP, When hệ thống sinh hạn cam kết, Then hệ thống áp dụng thời hạn theo quy tắc nghiệp vụ.
* **GWT25:** Given hệ thống xác định hạn cam kết, When tính ngày làm việc, Then hệ thống áp dụng quy tắc ngày làm việc của hệ thống.

---

## 3. Use Case

### 3.1. Danh sách Use Case

| Mã   | Use Case                     | Actor chính                             | MoSCoW |
| ---- | ---------------------------- | --------------------------------------- | ------ |
| UC01 | Tra cứu khách hàng           | Nhân viên tiếp nhận                     | MUST   |
| UC02 | Tạo hồ sơ khách hàng         | Nhân viên tiếp nhận                     | MUST   |
| UC03 | Ghi nhận thiết bị            | Nhân viên tiếp nhận                     | MUST   |
| UC04 | Kiểm tra tình trạng bảo hành | Nhân viên tiếp nhận / Quản lý trung tâm | MUST   |
| UC05 | Ghi nhận mô tả lỗi           | Nhân viên tiếp nhận                     | MUST   |
| UC06 | Phân loại nhóm sự cố         | Nhân viên tiếp nhận                     | MUST   |
| UC07 | Xác định mức ưu tiên         | Nhân viên tiếp nhận                     | SHOULD |
| UC08 | Sinh hạn cam kết             | Hệ thống Smart CRM                      | MUST   |

### 3.2. Trách nhiệm

| Đối tượng           | Trách nhiệm                                                                                                |
| ------------------- | ---------------------------------------------------------------------------------------------------------- |
| Nhân viên tiếp nhận | Tra cứu khách hàng, tạo hồ sơ, ghi nhận thiết bị, nhập mô tả lỗi, phân loại sự cố và xác định mức ưu tiên. |
| Quản lý trung tâm   | Hỗ trợ xác minh tình trạng bảo hành trong những trường hợp cần kiểm tra hoặc phê duyệt.                    |
| Hệ thống Smart CRM  | Kiểm tra dữ liệu, lưu thông tin, sinh hạn cam kết và ghi nhận lịch sử thay đổi.                            |

---

## 4. Yêu cầu chức năng

Trong phạm vi L2, em xác định các yêu cầu chức năng chính:

| Mã   | Yêu cầu                                                                 |
| ---- | ----------------------------------------------------------------------- |
| FR01 | Hệ thống cho phép tra cứu khách hàng bằng số điện thoại.                |
| FR02 | Hệ thống cho phép tạo hồ sơ khách hàng mới khi chưa tìm thấy thông tin. |
| FR03 | Hệ thống cho phép ghi nhận thiết bị bằng serial hoặc IMEI.              |
| FR04 | Hệ thống cho phép kiểm tra tình trạng bảo hành của thiết bị.            |
| FR05 | Hệ thống cho phép ghi nhận mô tả lỗi của khách hàng.                    |
| FR06 | Hệ thống cho phép phân loại nhóm sự cố.                                 |
| FR07 | Hệ thống cho phép xác định mức ưu tiên của phiếu.                       |
| FR08 | Hệ thống tự động sinh hạn cam kết dựa trên mức ưu tiên.                 |

---

## 5. Yêu cầu phi chức năng

| Mã    | Yêu cầu                    | Tiêu chí |
| ----- | -------------------------- | -------- |
| NFR01 | Thời gian phản hồi tra cứu | ≤ 2 giây |
| NFR02 | Thời gian tạo phiếu        | ≤ 3 giây |
| NFR03 | Tính sẵn sàng              | ≥ 99%    |
| NFR04 | Mã phiếu không trùng       | 100%     |
| NFR05 | Ghi nhận lịch sử thay đổi  | 100%     |
| NFR06 | Chuẩn hóa số điện thoại    | 100%     |

---

## 6. Truy vết yêu cầu

| User Story | Use Case | Functional Requirement |
| ---------- | -------- | ---------------------- |
| US01       | UC01     | FR01                   |
| US02       | UC02     | FR02                   |
| US03       | UC03     | FR03                   |
| US04       | UC04     | FR04                   |
| US05       | UC05     | FR05                   |
| US06       | UC06     | FR06                   |
| US07       | UC07     | FR07                   |
| US08       | UC08     | FR08                   |

---

# API CONTRACT – TRACK SE

## API 1 – Tra cứu khách hàng

**GET `/api/customers?phone={phone}`**

Mục đích: cho phép nhân viên tiếp nhận tra cứu thông tin khách hàng bằng số điện thoại.

**Response thành công – 200**

```json
{
  "customer_id": 1001,
  "full_name": "Nguyen Van An",
  "phone": "0901234567"
}
```

**Không tìm thấy – 404**

```json
{
  "error": "CUSTOMER_NOT_FOUND"
}
```

---

## API 2 – Tạo khách hàng

**POST `/api/customers`**

Mục đích: tạo hồ sơ khách hàng mới.

**Request**

```json
{
  "full_name": "Nguyen Van An",
  "phone": "0901234567",
  "email": "an@example.com"
}
```

**Response – 201**

```json
{
  "customer_id": 1001,
  "full_name": "Nguyen Van An",
  "phone": "0901234567"
}
```

---

## API 3 – Tra cứu thiết bị

**GET `/api/devices?serial_no={serial_no}`**

Mục đích: xác định thiết bị dựa trên serial hoặc IMEI.

**Response – 200**

```json
{
  "device_id": 501,
  "customer_id": 1001,
  "serial_no": "SN20260001",
  "purchase_date": "2026-01-15"
}
```

---

## API 4 – Tạo phiếu bảo hành

**POST `/api/tickets`**

Mục đích: tạo phiếu sau khi đã có thông tin khách hàng, thiết bị và nội dung yêu cầu.

**Request**

```json
{
  "customer_id": 1001,
  "device_id": 501,
  "description": "Máy không sạc được",
  "issue_category": "SAC",
  "priority": "CAO"
}
```

**Response – 201**

```json
{
  "ticket_code": "BH-000123",
  "status": "MOI",
  "priority": "CAO"
}
```





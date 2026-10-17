# SRS – Smart CRM Mekong Mobile
## Luồng L2: Tiếp nhận và phân loại yêu cầu bảo hành

## 1. Tổng quan

### 1.1. Mục đích

Tài liệu SRS (Software Requirements Specification) mô tả các yêu cầu phần mềm đối với luồng L2 – Tiếp nhận và phân loại yêu cầu bảo hành trong hệ thống Smart CRM của Mekong Mobile.

Tài liệu là cơ sở để phân tích nghiệp vụ, thiết kế hệ thống, xây dựng cơ sở dữ liệu và xác định các trường hợp kiểm thử trong những giai đoạn tiếp theo.

### 1.2. Phạm vi

Luồng L2 tập trung vào quá trình nhân viên tiếp nhận yêu cầu bảo hành từ khách hàng, bao gồm:

- Tra cứu thông tin khách hàng bằng số điện thoại.
- Tạo hồ sơ khách hàng mới khi chưa có dữ liệu.
- Ghi nhận và xác định thiết bị bằng serial hoặc IMEI.
- Kiểm tra tình trạng bảo hành.
- Ghi nhận mô tả lỗi của khách hàng.
- Phân loại nhóm sự cố.
- Xác định mức ưu tiên.
- Tự động sinh hạn cam kết xử lý theo SLA.

Các chức năng quản lý kho linh kiện, sửa chữa chi tiết, khảo sát mức độ hài lòng và dự đoán khách hàng rời bỏ dịch vụ không thuộc phạm vi L2.

### 1.3. Đối tượng sử dụng

| Đối tượng | Mô tả |
|---|---|
| Nhân viên tiếp nhận | Tra cứu khách hàng, ghi nhận thiết bị, nhập thông tin lỗi và phân loại yêu cầu bảo hành. |
| Quản lý trung tâm | Xác minh các trường hợp bảo hành thiếu thông tin hoặc cần kiểm tra, phê duyệt. |
| Hệ thống Smart CRM | Kiểm tra dữ liệu, lưu thông tin phiếu, sinh hạn cam kết và ghi nhận lịch sử thay đổi trạng thái. |

### 1.4. Thuật ngữ

| Thuật ngữ | Giải thích |
|---|---|
| CRM | Customer Relationship Management – hệ thống quản lý quan hệ khách hàng. |
| Ticket | Phiếu yêu cầu bảo hành. |
| Serial/IMEI | Mã định danh thiết bị. |
| Issue Category | Nhóm sự cố dùng để phân loại yêu cầu. |
| Priority | Mức độ ưu tiên xử lý. |
| SLA | Thời hạn cam kết xử lý yêu cầu. |
| GWT | Given – When – Then, dùng mô tả tiêu chí chấp nhận. |
| MoSCoW | Phương pháp phân loại mức độ ưu tiên yêu cầu. |

---

## 2. User Story

### US01 – Tra cứu khách hàng

**MoSCoW:** MUST

**User Story:** Là nhân viên tiếp nhận, em muốn tra cứu khách hàng bằng số điện thoại để xác định đúng hồ sơ trước khi tiếp nhận yêu cầu bảo hành.

**Tiêu chí chấp nhận:**

- **GWT01:** Given số điện thoại hợp lệ, When nhân viên thực hiện tra cứu, Then hệ thống hiển thị hồ sơ khách hàng tương ứng.
- **GWT02:** Given số điện thoại chưa tồn tại, When nhân viên thực hiện tra cứu, Then hệ thống thông báo không tìm thấy hồ sơ và cho phép tạo hồ sơ mới.
- **GWT03 – Ngoại lệ:** Given số điện thoại đã tồn tại, When nhân viên tra cứu lại, Then hệ thống hiển thị hồ sơ có sẵn và không tạo hồ sơ trùng.

### US02 – Tạo hồ sơ khách hàng

**MoSCoW:** MUST

**User Story:** Là nhân viên tiếp nhận, em muốn tạo hồ sơ khách hàng mới khi chưa tìm thấy thông tin để phục vụ quá trình tiếp nhận bảo hành.

**Tiêu chí chấp nhận:**

- **GWT04:** Given số điện thoại chưa tồn tại, When nhân viên nhập thông tin hợp lệ, Then hệ thống tạo hồ sơ khách hàng mới.
- **GWT05:** Given số điện thoại được nhập theo định dạng được chấp nhận, When hệ thống lưu thông tin, Then số điện thoại được chuẩn hóa theo quy định.
- **GWT06 – Ngoại lệ:** Given số điện thoại đã tồn tại, When nhân viên tạo hồ sơ mới, Then hệ thống từ chối tạo bản ghi trùng và thông báo hồ sơ đã tồn tại.

### US03 – Ghi nhận thiết bị

**MoSCoW:** MUST

**User Story:** Là nhân viên tiếp nhận, em muốn ghi nhận thiết bị bằng serial hoặc IMEI để xác định chính xác thiết bị của khách hàng.

**Tiêu chí chấp nhận:**

- **GWT07:** Given serial hoặc IMEI hợp lệ, When hệ thống tra cứu, Then hệ thống hiển thị thông tin thiết bị tương ứng.
- **GWT08:** Given thiết bị thuộc khách hàng đang được tiếp nhận, When nhân viên ghi nhận thiết bị, Then hệ thống xác nhận liên kết giữa thiết bị và khách hàng.
- **GWT09 – Ngoại lệ:** Given thiết bị đã được liên kết với khách hàng khác, When nhân viên ghi nhận thiết bị, Then hệ thống không cho phép tự ý liên kết sai khách hàng.

### US04 – Kiểm tra tình trạng bảo hành

**MoSCoW:** MUST

**User Story:** Là nhân viên tiếp nhận, em muốn kiểm tra tình trạng bảo hành của thiết bị để xác định thông tin bảo hành trước khi tiếp nhận yêu cầu.

**Tiêu chí chấp nhận:**

- **GWT10:** Given thiết bị có đủ ngày mua và thời hạn bảo hành, When hệ thống kiểm tra, Then hệ thống xác định tình trạng bảo hành theo dữ liệu hiện có.
- **GWT11:** Given thiết bị thiếu ngày mua hoặc thông tin cần thiết, When hệ thống kiểm tra, Then hệ thống đánh dấu “Chưa xác minh bảo hành”.
- **GWT12 – Ngoại lệ:** Given tình trạng bảo hành chưa được xác minh, When cần tiếp tục xử lý, Then hệ thống ghi nhận yêu cầu xác minh để quản lý trung tâm kiểm tra.

### US05 – Ghi nhận mô tả lỗi

**MoSCoW:** MUST

**User Story:** Là nhân viên tiếp nhận, em muốn ghi nhận mô tả lỗi do khách hàng cung cấp để lưu lại nội dung yêu cầu bảo hành.

**Tiêu chí chấp nhận:**

- **GWT13:** Given khách hàng cung cấp thông tin lỗi, When nhân viên nhập mô tả, Then hệ thống lưu mô tả vào phiếu.
- **GWT14:** Given mô tả lỗi đã được nhập, When nhân viên xem lại phiếu, Then hệ thống hiển thị đầy đủ nội dung đã lưu.
- **GWT15 – Ngoại lệ:** Given mô tả lỗi chưa được nhập, When nhân viên hoàn tất bước tiếp nhận, Then hệ thống yêu cầu bổ sung thông tin.

### US06 – Phân loại nhóm sự cố

**MoSCoW:** MUST

**User Story:** Là nhân viên tiếp nhận, em muốn phân loại yêu cầu vào nhóm sự cố phù hợp để thống nhất thông tin bảo hành và hỗ trợ xử lý.

**Tiêu chí chấp nhận:**

- **GWT16:** Given mô tả lỗi đã được ghi nhận, When nhân viên chọn nhóm sự cố, Then hệ thống lưu nhóm sự cố vào phiếu.
- **GWT17:** Given nhóm sự cố hợp lệ, When nhân viên xác nhận phân loại, Then hệ thống ghi nhận nhóm tương ứng.
- **GWT18 – Ngoại lệ:** Given chưa chọn nhóm sự cố, When nhân viên hoàn tất phân loại, Then hệ thống yêu cầu chọn nhóm sự cố.

### US07 – Xác định mức ưu tiên

**MoSCoW:** MUST

**User Story:** Là nhân viên tiếp nhận, em muốn xác định mức ưu tiên cho phiếu bảo hành để hệ thống có cơ sở tính hạn cam kết xử lý.

**Tiêu chí chấp nhận:**

- **GWT19:** Given phiếu đã được tiếp nhận, When nhân viên xác định mức ưu tiên, Then hệ thống lưu một trong ba mức `CAO`, `TRUNG_BINH` hoặc `THAP`.
- **GWT20:** Given mức ưu tiên đã được xác định, When hệ thống sinh hạn cam kết, Then thời hạn được tính theo mức ưu tiên và lịch làm việc.
- **GWT21 – Ngoại lệ:** Given mức ưu tiên không hợp lệ, When nhân viên xác nhận, Then hệ thống thông báo dữ liệu không hợp lệ và không lưu giá trị sai.

### US08 – Sinh hạn cam kết

**MoSCoW:** MUST

**User Story:** Là nhân viên tiếp nhận, em muốn hệ thống tự động sinh hạn cam kết theo mức ưu tiên để hạn chế tính toán thủ công.

**Tiêu chí chấp nhận:**

- **GWT22:** Given mức ưu tiên là `CAO`, When hệ thống tính SLA, Then hệ thống áp dụng thời hạn 24 giờ làm việc.
- **GWT23:** Given mức ưu tiên là `TRUNG_BINH`, When hệ thống tính SLA, Then hệ thống áp dụng thời hạn 72 giờ làm việc.
- **GWT24:** Given mức ưu tiên là `THAP`, When hệ thống tính SLA, Then hệ thống áp dụng thời hạn 120 giờ làm việc.
- **GWT25:** Given hệ thống tính hạn cam kết, When xác định thời gian xử lý, Then hệ thống áp dụng lịch làm việc từ thứ Hai đến thứ Bảy và loại trừ thời gian ngoài lịch đã cấu hình.

---

## 3. Use Case

### 3.1. Danh sách Use Case

| Mã | Tên Use Case | Actor chính | MoSCoW |
|---|---|---|---|
| UC01 | Tra cứu khách hàng | Nhân viên tiếp nhận | MUST |
| UC02 | Tạo hồ sơ khách hàng | Nhân viên tiếp nhận | MUST |
| UC03 | Ghi nhận thiết bị | Nhân viên tiếp nhận | MUST |
| UC04 | Kiểm tra tình trạng bảo hành | Nhân viên tiếp nhận, Quản lý trung tâm | MUST |
| UC05 | Ghi nhận mô tả lỗi | Nhân viên tiếp nhận | MUST |
| UC06 | Phân loại nhóm sự cố | Nhân viên tiếp nhận | MUST |
| UC07 | Xác định mức ưu tiên | Nhân viên tiếp nhận | MUST |
| UC08 | Sinh hạn cam kết | Hệ thống Smart CRM | MUST |

### 3.2. Đặc tả UC01 – Tra cứu khách hàng

- **Actor chính:** Nhân viên tiếp nhận.
- **Tiền điều kiện:** Nhân viên đã truy cập hệ thống.
- **Hậu điều kiện:** Hồ sơ khách hàng được hiển thị nếu tìm thấy.

**Luồng chính:**

1. Nhân viên mở chức năng tra cứu khách hàng.
2. Nhân viên nhập số điện thoại.
3. Hệ thống kiểm tra định dạng số điện thoại.
4. Hệ thống tìm kiếm khách hàng theo số điện thoại.
5. Hệ thống hiển thị hồ sơ nếu tìm thấy.

**Luồng ngoại lệ:**

- Nếu số điện thoại sai định dạng, hệ thống thông báo và yêu cầu nhập lại.
- Nếu không tìm thấy hồ sơ, hệ thống thông báo không có dữ liệu và cho phép chuyển sang UC02.
- Nếu số điện thoại đã có hồ sơ, hệ thống hiển thị hồ sơ đó thay vì tạo bản ghi mới.

### 3.3. Đặc tả UC04 – Kiểm tra tình trạng bảo hành

- **Actor chính:** Nhân viên tiếp nhận.
- **Actor hỗ trợ:** Quản lý trung tâm.
- **Tiền điều kiện:** Thiết bị đã được xác định.
- **Hậu điều kiện:** Tình trạng bảo hành được ghi nhận hoặc đánh dấu chưa xác minh.

**Luồng chính:**

1. Nhân viên chọn thiết bị cần kiểm tra.
2. Hệ thống kiểm tra ngày mua và thông tin thời hạn bảo hành.
3. Hệ thống xác định tình trạng bảo hành theo dữ liệu hiện có.
4. Hệ thống hiển thị kết quả cho nhân viên.
5. Nhân viên tiếp tục quy trình tiếp nhận theo kết quả kiểm tra.

**Luồng ngoại lệ:**

- Nếu thiếu ngày mua hoặc thông tin cần thiết, hệ thống đánh dấu “Chưa xác minh bảo hành”.
- Nếu thông tin bảo hành không nhất quán, hệ thống yêu cầu quản lý trung tâm kiểm tra.
- Hệ thống không tự kết luận thiết bị còn bảo hành khi dữ liệu chưa đủ căn cứ.

### 3.4. Trách nhiệm

| Đối tượng | Trách nhiệm |
|---|---|
| Nhân viên tiếp nhận | Tra cứu khách hàng, tạo hồ sơ, ghi nhận thiết bị, nhập mô tả lỗi, phân loại sự cố và xác định mức ưu tiên. |
| Quản lý trung tâm | Hỗ trợ xác minh các trường hợp bảo hành cần kiểm tra hoặc phê duyệt. |
| Hệ thống Smart CRM | Kiểm tra dữ liệu, lưu thông tin, sinh hạn cam kết và ghi nhận lịch sử thay đổi trạng thái. |

**Hình 1.** Sơ đồ Use Case L2 – Tiếp nhận và phân loại yêu cầu bảo hành.

**Hình 2.** Sơ đồ luồng nghiệp vụ L2 – Tiếp nhận và phân loại yêu cầu bảo hành.

---

## 4. Yêu cầu chức năng

| Mã | Yêu cầu chức năng |
|---|---|
| FR01 | Hệ thống cho phép tra cứu khách hàng bằng số điện thoại. |
| FR02 | Hệ thống cho phép tạo hồ sơ khách hàng mới khi chưa tìm thấy thông tin. |
| FR03 | Hệ thống cho phép ghi nhận và xác định thiết bị bằng serial hoặc IMEI. |
| FR04 | Hệ thống cho phép kiểm tra tình trạng bảo hành và đánh dấu trường hợp chưa xác minh. |
| FR05 | Hệ thống cho phép ghi nhận mô tả lỗi của khách hàng. |
| FR06 | Hệ thống cho phép phân loại nhóm sự cố cho phiếu bảo hành. |
| FR07 | Hệ thống cho phép xác định mức ưu tiên của phiếu. |
| FR08 | Hệ thống tự động sinh hạn cam kết dựa trên mức ưu tiên và lịch làm việc. |

---

## 5. Quy tắc nghiệp vụ và yêu cầu phi chức năng

### 5.1. Quy tắc nghiệp vụ

| Mã | Quy tắc |
|---|---|
| QT01 | Số điện thoại khách hàng phải được chuẩn hóa trước khi lưu. |
| QT02 | Số điện thoại không được trùng giữa các hồ sơ khách hàng. |
| QT03 | Thiết bị phải được liên kết đúng với khách hàng sở hữu. |
| QT04 | Thiếu ngày mua hoặc dữ liệu cần thiết thì tình trạng bảo hành phải được đánh dấu chưa xác minh. |
| QT05 | Mô tả lỗi là thông tin bắt buộc trước khi hoàn tất tiếp nhận. |
| QT06 | Phiếu phải có nhóm sự cố hợp lệ trước khi hoàn tất phân loại. |
| QT07 | Mức ưu tiên hợp lệ gồm `CAO`, `TRUNG_BINH`, `THAP`. |
| QT08 | SLA tương ứng là 24, 72 và 120 giờ làm việc cho ba mức ưu tiên. |
| QT09 | Lịch làm việc mặc định từ thứ Hai đến thứ Bảy; giờ làm việc và ngày nghỉ cần được cấu hình. |
| QT10 | Mỗi phiếu phải có mã duy nhất và các lần thay đổi trạng thái phải được ghi nhận trong lịch sử. |

### 5.2. Yêu cầu phi chức năng

| Mã | Yêu cầu | Tiêu chí |
|---|---|---|
| NFR01 | Thời gian phản hồi tra cứu | Ít nhất 95% yêu cầu tra cứu hoàn thành trong không quá 2 giây. |
| NFR02 | Thời gian tạo phiếu | Ít nhất 95% thao tác tạo phiếu hoàn thành trong không quá 3 giây. |
| NFR03 | Tính sẵn sàng | Mục tiêu đạt ít nhất 99% theo tháng. |
| NFR04 | Mã phiếu không trùng | 100% mã phiếu duy nhất; kiểm thử ít nhất 1.000 lần tạo phiếu không có mã trùng. |
| NFR05 | Ghi nhận lịch sử thay đổi | 100% lần chuyển trạng thái hợp lệ có bản ghi lịch sử tương ứng. |
| NFR06 | Chuẩn hóa số điện thoại | 100% số điện thoại hợp lệ được chuẩn hóa trước khi lưu; dữ liệu sai định dạng bị từ chối hoặc yêu cầu chỉnh sửa. |

Các tiêu chí trên là mục tiêu thiết kế và kiểm thử đề xuất, không phải kết quả đo kiểm thực tế.

---

## 6. Truy vết yêu cầu

| User Story | MoSCoW | Use Case | Functional Requirement |
|---|---|---|---|
| US01 | MUST | UC01 | FR01 |
| US02 | MUST | UC02 | FR02 |
| US03 | MUST | UC03 | FR03 |
| US04 | MUST | UC04 | FR04 |
| US05 | MUST | UC05 | FR05 |
| US06 | MUST | UC06 | FR06 |
| US07 | MUST | UC07 | FR07 |
| US08 | MUST | UC08 | FR08 |

Bảng truy vết giúp đối chiếu yêu cầu người dùng với Use Case và yêu cầu chức năng tương ứng. Các mã yêu cầu cần được giữ thống nhất trong SRS, sơ đồ nghiệp vụ, sơ đồ Use Case và tài liệu thiết kế liên quan.

---

## 7. Thiết kế kiến trúc đề xuất

Hệ thống được đề xuất theo mô hình ba lớp:

1. **Presentation Layer:** Giao diện dành cho nhân viên tiếp nhận và quản lý trung tâm.
2. **Business Logic Layer:** Xử lý tra cứu khách hàng, kiểm tra thiết bị, xác minh bảo hành, phân loại sự cố, tính SLA và kiểm tra quy tắc nghiệp vụ.
3. **Data Layer:** Lưu thông tin khách hàng, thiết bị, phiếu bảo hành, nhân viên kỹ thuật và lịch sử trạng thái.

### 7.1. Lý do lựa chọn kiến trúc

- **Vì NFR01 yêu cầu ít nhất 95% yêu cầu tra cứu hoàn thành trong không quá 2 giây, em chọn** tách lớp xử lý nghiệp vụ khỏi giao diện và xây dựng chỉ mục cho các trường tra cứu thường xuyên. Đánh đổi là cần thiết kế và bảo trì thêm các thành phần xử lý dữ liệu.
- **Vì NFR04 yêu cầu mã phiếu không trùng, em chọn** sử dụng ràng buộc duy nhất ở cơ sở dữ liệu kết hợp cơ chế sinh mã phiếu. Đánh đổi là hệ thống phải xử lý trường hợp xung đột hoặc lỗi khi tạo phiếu.
- **Vì NFR05 yêu cầu ghi nhận đầy đủ lịch sử thay đổi, em chọn** lưu lịch sử trạng thái trong bảng `ticket_status_log`. Đánh đổi là dung lượng lưu trữ tăng và cần quy định rõ thời điểm ghi lịch sử.

Đây là phương án kiến trúc đề xuất cho phạm vi phân tích, không phải xác nhận hệ thống đã được triển khai.

**Hình 3.** Sơ đồ kiến trúc ba lớp của Smart CRM – L2.

---

## 8. Thiết kế dữ liệu

Mô hình dữ liệu đề xuất gồm năm bảng:

| Bảng | Vai trò |
|---|---|
| `customer` | Lưu thông tin khách hàng; số điện thoại được kiểm tra tính duy nhất. |
| `device` | Lưu thiết bị và khách hàng sở hữu; có mã serial hoặc IMEI. |
| `technician` | Lưu thông tin nhân viên kỹ thuật. |
| `ticket` | Lưu phiếu bảo hành, khách hàng, thiết bị, mô tả lỗi, nhóm sự cố, mức ưu tiên và hạn SLA. |
| `ticket_status_log` | Lưu lịch sử trạng thái của phiếu bảo hành. |

### 8.1. Quan hệ giữa các bảng

- Một khách hàng có thể sở hữu nhiều thiết bị.
- Một khách hàng có thể có nhiều phiếu bảo hành.
- Một thiết bị có thể phát sinh nhiều phiếu theo thời gian.
- Một nhân viên kỹ thuật có thể được liên kết với nhiều phiếu.
- Một phiếu có thể có nhiều bản ghi lịch sử trạng thái.
- `issue_category` được lưu trực tiếp trong bảng `ticket`.

**Hình 4.** Sơ đồ ERD của mô hình dữ liệu L2. Sơ đồ cần thống nhất đúng năm bảng nêu trên với file `docs/database.sql`.

---

## 9. Thiết kế giao diện đề xuất

### 9.1. Màn hình tra cứu khách hàng

Màn hình gồm ô nhập số điện thoại, nút tra cứu và khu vực hiển thị thông tin khách hàng. Nếu không tìm thấy hồ sơ, hệ thống cung cấp lựa chọn tạo khách hàng mới.

**Hình 5.** Wireframe màn hình tra cứu khách hàng.

### 9.2. Màn hình ghi nhận thiết bị và kiểm tra bảo hành

Màn hình cho phép nhập serial hoặc IMEI, hiển thị thông tin thiết bị và ngày mua. Kết quả kiểm tra bảo hành được hiển thị rõ ràng. Trường hợp thiếu thông tin phải có nhãn “Chưa xác minh bảo hành”.

**Hình 6.** Wireframe màn hình ghi nhận thiết bị và kiểm tra bảo hành.

### 9.3. Màn hình tiếp nhận và phân loại yêu cầu

Màn hình gồm trường mô tả lỗi, nhóm sự cố, mức ưu tiên và hạn cam kết dự kiến. Khi mức ưu tiên thay đổi, hệ thống tính lại hạn SLA theo quy tắc nghiệp vụ.

**Hình 7.** Wireframe màn hình tiếp nhận và phân loại yêu cầu bảo hành.

Các wireframe là bản thiết kế đề xuất. Tên trường, nội dung và thứ tự thao tác cần thống nhất với User Story, Use Case và mô hình dữ liệu.

---

## 10. Ngoài phạm vi

Các chức năng sau không thuộc phạm vi L2 trong tài liệu này:

- Quản lý tồn kho và xuất nhập linh kiện.
- Theo dõi chi tiết từng công đoạn sửa chữa.
- Khảo sát mức độ hài lòng sau sửa chữa.
- Phân tích dự đoán khách hàng rời bỏ dịch vụ.

---

## 11. Kết luận

Tài liệu SRS đã xác định phạm vi nghiệp vụ L2 – Tiếp nhận và phân loại yêu cầu bảo hành của hệ thống Smart CRM – Mekong Mobile. Các yêu cầu được mô tả qua User Story, Use Case, yêu cầu chức năng, quy tắc nghiệp vụ và yêu cầu phi chức năng.

Tài liệu cũng đề xuất mô hình kiến trúc ba lớp, mô hình dữ liệu năm bảng và các màn hình giao diện chính. Những nội dung này là cơ sở để tiếp tục hoàn thiện sơ đồ, API Contract, thiết kế cơ sở dữ liệu và kế hoạch kiểm thử ở các giai đoạn tiếp theo.
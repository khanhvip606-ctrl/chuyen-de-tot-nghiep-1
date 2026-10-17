\# NHẬT KÝ THAY ĐỔI THIẾT KẾ

\## Smart CRM – Mekong Mobile



\- Sinh viên: Nguyễn Quốc Khánh

\- MSSV: 2374802010224

\- Track: SE – Software Engineering

\- Luồng nghiệp vụ: L2 – Tiếp nhận và phân loại yêu cầu bảo hành

\- Giai đoạn: Sprint 1



\---





\# Ghi nhận thay đổi thiết kế – Smart CRM Mekong Mobile



\## 1. Phạm vi triển khai



Trong Buổi 08, em tiếp tục triển khai luồng L2: tiếp nhận và phân loại yêu cầu bảo hành trong hệ thống Smart CRM Mekong Mobile.



Phạm vi tập trung vào quản lý thông tin khách hàng, thiết bị, phiếu bảo hành, mức độ ưu tiên và lịch sử trạng thái của phiếu.



\## 2. Các quyết định thiết kế



\### 2.1. Tổ chức mã nguồn



Em giữ kiến trúc ba lớp gồm Routes, Services và Repositories.



\- Routes tiếp nhận HTTP request và trả về HTTP response.

\- Services kiểm tra dữ liệu và xử lý quy tắc nghiệp vụ.

\- Repositories thực hiện truy vấn và cập nhật SQLite.



Cách tổ chức này giúp tách biệt xử lý HTTP, nghiệp vụ và truy cập dữ liệu.



\### 2.2. Cấu trúc cơ sở dữ liệu



Cơ sở dữ liệu SQLite hiện sử dụng các bảng customer, device, technician, ticket và ticket\_status\_log.



Các bảng có khóa chính; các quan hệ cần thiết sử dụng khóa ngoại. Số điện thoại khách hàng và mã phiếu bảo hành được ràng buộc duy nhất.



Các câu lệnh tạo bảng và chỉ mục sử dụng IF NOT EXISTS để hỗ trợ chạy migration nhiều lần.



\### 2.3. Khởi tạo và dữ liệu mẫu



Em bổ sung lệnh npm run migrate để khởi tạo cơ sở dữ liệu và lệnh npm run seed để tạo dữ liệu mẫu.



Dữ liệu mẫu sử dụng các khóa duy nhất và INSERT OR IGNORE tại các vị trí phù hợp để hạn chế bản ghi trùng khi chạy lại.



\### 2.4. Xử lý phiếu bảo hành



Em bổ sung API cập nhật trạng thái phiếu bảo hành và API xem lịch sử trạng thái.



Khi cập nhật trạng thái, hệ thống lưu trạng thái cũ, trạng thái mới, ghi chú và người thực hiện vào bảng ticket\_status\_log trong cùng transaction với thao tác cập nhật phiếu.



\## 3. Kết quả kiểm thử



Các kết quả đã kiểm tra tại môi trường phát triển:



\- Migration chạy lại thành công.

\- Seed chạy lần thứ hai không làm tăng số bản ghi.

\- API xem danh sách khách hàng, thiết bị và phiếu bảo hành trả về dữ liệu.

\- API tạo phiếu hợp lệ trả về HTTP 201.

\- Dữ liệu có mức ưu tiên không hợp lệ bị từ chối với HTTP 400.

\- Thiết bị không thuộc khách hàng đã chọn bị từ chối với HTTP 400.

\- Mô tả lỗi để trống bị từ chối với HTTP 400.

\- API cập nhật trạng thái và xem lịch sử trả về HTTP 200.

\- Unit test hiện có: 2 PASS, 0 FAIL.



\## 4. Những nội dung cần hoàn thiện



\### 4.1. Quy tắc tính SLA



Hiện tại, thời hạn SLA được tính bằng cách cộng 24, 72 hoặc 120 giờ liên tục tùy theo mức ưu tiên.



Cách tính này chưa đáp ứng đầy đủ quy tắc tính theo ngày làm việc từ thứ Hai đến thứ Bảy. Cần hoàn thiện và kiểm thử quy tắc này trước khi xem nghiệp vụ SLA là hoàn thành.



\### 4.2. Kiểm thử bổ sung



Cần bổ sung unit test cho trường hợp tạo phiếu hợp lệ, cập nhật trạng thái, ghi lịch sử trạng thái và các trường hợp lỗi khác.



Cần tiếp tục kiểm tra các API và đối chiếu kết quả với yêu cầu trong SRS.



\## 5. Kết luận



Buổi 08 đã hoàn thiện một phần nền tảng backend của luồng L2, bao gồm migration, seed dữ liệu, các API đọc và tạo phiếu, cùng chức năng cập nhật và theo dõi lịch sử trạng thái.



Các nội dung chưa hoàn thiện được ghi nhận để tiếp tục thực hiện và kiểm thử ở các bước tiếp theo.




\# NHẬT KÝ THAY ĐỔI THIẾT KẾ

\## Smart CRM – Mekong Mobile



\- Sinh viên: Nguyễn Quốc Khánh

\- MSSV: 2374802010224

\- Track: SE – Software Engineering

\- Luồng nghiệp vụ: L2 – Tiếp nhận và phân loại yêu cầu bảo hành

\- Giai đoạn: Sprint 1



\---



\## TD-01 – Hoàn thiện đặc tả Use Case



\- \*\*Phản hồi:\*\* Đặc tả Use Case cần thể hiện rõ tác nhân, điều kiện trước, điều kiện sau, luồng chính và các trường hợp ngoại lệ.

\- \*\*Quyết định:\*\* SỬA.

\- \*\*Lý do:\*\* Đặc tả chưa đầy đủ sẽ gây khó khăn khi triển khai chức năng và xác định tiêu chí kiểm thử.

\- \*\*Ảnh hưởng:\*\* Rà soát và hoàn thiện UC01–UC08, bảo đảm các bước nghiệp vụ phù hợp với luồng L2 và các yêu cầu chức năng tương ứng.



\## TD-02 – Làm rõ mức độ ưu tiên yêu cầu



\- \*\*Phản hồi:\*\* Phân loại mức độ ưu tiên cần nhất quán với phạm vi chức năng và kế hoạch triển khai.

\- \*\*Quyết định:\*\* SỬA.

\- \*\*Lý do:\*\* Phân loại MoSCoW giúp xác định chức năng bắt buộc, chức năng nên có và chức năng chưa triển khai.

\- \*\*Ảnh hưởng:\*\* Rà soát mức ưu tiên của User Story và yêu cầu chức năng; điều chỉnh UC07 sang MUST theo thiết kế đã thống nhất và bổ sung phạm vi WON’T.



\## TD-03 – Bổ sung khả năng kiểm chứng NFR



\- \*\*Phản hồi:\*\* Yêu cầu phi chức năng cần có tiêu chí đo lường hoặc kiểm thử cụ thể.

\- \*\*Quyết định:\*\* SỬA.

\- \*\*Lý do:\*\* Các phát biểu chung chung khó xác định hệ thống có đáp ứng yêu cầu hay không.

\- \*\*Ảnh hưởng:\*\* Cụ thể hóa NFR04 bằng tiêu chí kiểm thử 1.000 phiếu yêu cầu không trùng mã; rà soát các NFR còn lại và liên kết chúng với phương án kiểm thử.



\## TD-04 – Đồng bộ mô hình dữ liệu và DDL



\- \*\*Phản hồi:\*\* Sơ đồ dữ liệu và câu lệnh tạo bảng phải nhất quán với nghiệp vụ và các tài liệu thiết kế.

\- \*\*Quyết định:\*\* SỬA.

\- \*\*Lý do:\*\* Sự không nhất quán giữa ERD, DDL và API Contract có thể gây lỗi khi triển khai cơ sở dữ liệu.

\- \*\*Ảnh hưởng:\*\* Rà soát ERD và database.sql theo mô hình 5 bảng đã thống nhất; thông tin nhóm sự cố được lưu trong phiếu yêu cầu theo thiết kế đã chọn.



\## TD-05 – Tăng tính truy vết giữa các tài liệu



\- \*\*Phản hồi:\*\* Cần bảo đảm yêu cầu, Use Case, thiết kế dữ liệu và tiêu chí kiểm thử có thể đối chiếu với nhau.

\- \*\*Quyết định:\*\* SỬA.

\- \*\*Lý do:\*\* Truy vết giúp hạn chế bỏ sót yêu cầu và hỗ trợ kiểm thử trong các sprint tiếp theo.

\- \*\*Ảnh hưởng:\*\* Rà soát liên kết giữa User Story, FR, UC, NFR, API Contract và mô hình dữ liệu; điều chỉnh nội dung tài liệu để thống nhất thuật ngữ và phạm vi L2.



\---



\## Nguyên tắc áp dụng trong Sprint 1



Sprint 1 ưu tiên hiện thực module cốt lõi phục vụ tiếp nhận và phân loại yêu cầu bảo hành. Thiết kế tiếp tục tuân theo kiến trúc phân lớp đã chọn và phạm vi BT1.



Các chức năng quản lý kho, sửa chữa chi tiết, khảo sát hài lòng và thanh toán không thuộc phạm vi hiện thực của luồng L2 trong giai đoạn này.



Các thay đổi tiếp theo phải được đối chiếu với SRS, API Contract, database.sql và sơ đồ kiến trúc trước khi triển khai.




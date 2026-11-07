\# BUG LOG – SMART CRM MEKONG MOBILE



\## BUG-01: Middleware không chấp nhận Bearer viết thường



\- \*\*Mã lỗi / Mức độ:\*\* BUG-01 / Minor

\- \*\*Người phát hiện:\*\* Kiểm thử thủ công và unit test.

\- \*\*Triệu chứng:\*\* API từ chối token hợp lệ khi Authorization sử dụng `bearer` viết thường.

\- \*\*Cách tái hiện:\*\* Gửi request có header `Authorization: bearer <valid-token>`.

\- \*\*Nguyên nhân gốc:\*\* Middleware kiểm tra chuỗi `Bearer ` phân biệt chữ hoa và chữ thường.

\- \*\*Cách sửa:\*\* Sử dụng `/^Bearer\\s/i` để kiểm tra scheme không phân biệt hoa thường.

\- \*\*Commit và xác minh:\*\* Commit `2011457`. Unit test middleware PASS; toàn bộ 52 tests PASS.



\## BUG-02: Không phân biệt danh sách trống và kết quả lọc trống



\- \*\*Mã lỗi / Mức độ:\*\* BUG-02 / Major (không đạt tiêu chí nghiệm thu S4).

\- \*\*Người phát hiện:\*\* Giảng viên phản hồi khi đánh giá BT2.

\- \*\*Triệu chứng:\*\* Giao diện chưa phân biệt hệ thống chưa có phiếu bảo hành với tìm kiếm hoặc lọc không có kết quả.

\- \*\*Cách tái hiện:\*\* Mở danh sách phiếu bảo hành, kiểm tra trạng thái chưa có dữ liệu và tìm kiếm bằng từ khóa không tồn tại.

\- \*\*Nguyên nhân gốc:\*\* Giao diện sử dụng thông báo rỗng chung, chưa xét dữ liệu gốc và dữ liệu sau lọc.

\- \*\*Cách sửa:\*\* Cập nhật DataState và danh sách phiếu để hiển thị hai thông báo riêng: “Chưa có phiếu bảo hành” và “Không tìm thấy kết quả”.

\- \*\*Commit và xác minh:\*\* `npm run build` thành công. Chưa hoàn tất kiểm tra hai trạng thái trên giao diện và chưa có commit BUG-02.


\# Smart CRM – Mekong Mobile



\## 1. Mục tiêu



Đề tài tập trung phân tích \*\*Luồng L2 – Tiếp nhận và phân loại yêu cầu bảo hành\*\* trong hệ thống Smart CRM của Mekong Mobile.



Mục tiêu của bài thực hành là phân tích yêu cầu nghiệp vụ và chuyển đổi thành các tài liệu đặc tả phần mềm gồm SRS, User Story, Use Case, Business Flow và API Contract.



Phạm vi chính gồm:



\* Tra cứu thông tin khách hàng.

\* Tạo hồ sơ khách hàng.

\* Ghi nhận thông tin thiết bị.

\* Kiểm tra tình trạng bảo hành.

\* Ghi nhận mô tả lỗi.

\* Phân loại nhóm sự cố.

\* Xác định mức độ ưu tiên.

\* Xác định hạn cam kết xử lý.



\## 2. Yêu cầu môi trường



Repository chủ yếu chứa tài liệu phân tích và đặc tả yêu cầu, không yêu cầu triển khai backend hoặc frontend để thực hiện bài Buổi 04.



Môi trường đề xuất:



\* Windows 10/11.

\* Git.

\* draw.io Desktop hoặc draw.io trên trình duyệt để mở và chỉnh sửa file `.drawio`.

\* Trình soạn thảo Markdown như Visual Studio Code hoặc Notepad.

\* Không yêu cầu cơ sở dữ liệu hoặc server để kiểm tra các tài liệu phân tích.



\## 3. Cấu trúc thư mục



```text

chuyên đề tốt nghiệp 1/

├── diagrams/

│   ├── business\_flow\_L2.drawio

│   └── use\_case\_L2.drawio

│

├── docs/

│   ├── ai-disclosure.md

│   ├── api-contract.md

│   ├── srs.md

│   └── usecase.drawio

│

├── .env.example

├── .gitignore

└── README.md

```



\## 4. Tài liệu chính



| Tài liệu                           | Nội dung                            |

| ---------------------------------- | ----------------------------------- |

| `docs/srs.md`                      | Software Requirements Specification |

| `docs/usecase.drawio`              | Use Case Diagram                    |

| `docs/api-contract.md`             | API Contract cho Track SE           |

| `docs/ai-disclosure.md`            | Công khai việc sử dụng AI           |

| `diagrams/business\_flow\_L2.drawio` | Business Flow của luồng L2          |

| `diagrams/use\_case\_L2.drawio`      | Use Case Diagram bản gốc            |



\## 5. Luồng được phân tích



\*\*L2 – Tiếp nhận và phân loại yêu cầu bảo hành\*\*



Actor chính:



\* Nhân viên tiếp nhận.

\* Quản lý trung tâm.



Các Use Case chính:



\* UC01 – Tra cứu khách hàng.

\* UC02 – Tạo hồ sơ khách hàng.

\* UC03 – Ghi nhận thiết bị.

\* UC04 – Kiểm tra tình trạng bảo hành.

\* UC05 – Ghi nhận mô tả lỗi.

\* UC06 – Phân loại nhóm sự cố.

\* UC07 – Xác định mức ưu tiên.

\* UC08 – Sinh hạn cam kết.



\## 6. Trạng thái hiện tại



Buổi 04 đã hoàn thành các sản phẩm phân tích yêu cầu chính:



\* Hoàn thành SRS cho luồng L2.

\* Hoàn thành User Story và Acceptance Criteria.

\* Hoàn thành Use Case và phân công trách nhiệm.

\* Hoàn thành Functional Requirements và Non-functional Requirements.

\* Hoàn thành bảng Traceability.

\* Hoàn thành Use Case Diagram ở định dạng `.drawio`.

\* Hoàn thành Business Flow.

\* Hoàn thành API Contract cho Track SE.

\* Hoàn thành tài liệu AI Disclosure.

\* Hoàn thiện cấu trúc repository và các file cấu hình Git cơ bản.



Các tài liệu được lưu trong thư mục `docs/` và các sơ đồ được lưu trong thư mục `diagrams/`.




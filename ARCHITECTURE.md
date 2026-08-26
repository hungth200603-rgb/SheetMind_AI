# 🏛️ SheetMind AI — System Architecture Specification

# 1. Executive Summary
**SheetMind AI** là hệ thống xử lý chứng từ thông minh (Intelligent Document Processing - IDP) ứng dụng các mô hình thị giác-ngôn ngữ (Vision-Language Models - VLM). Hệ thống tự động phân tích, trích xuất dữ liệu từ các tệp hóa đơn/chứng từ phi cấu trúc (PDF, PNG, JPG) và chuyển đổi thành dữ liệu có cấu trúc định dạng Excel (.xlsx) chuẩn nghiệp vụ kế toán.

---

# 2. System Architecture & Data Flow

## 2.1 High-Level Architecture Diagram
```text
┌──────────────┐     1. Upload PDF/Image     ┌──────────────────┐
│              ├────────────────────────────►│                  │
│ Next.js Web  │                             │  FastAPI Server  │
│  (Frontend)  │◄────────────────────────────┤    (Backend)     │
└──────────────┘     6. Return Excel Stream  └─────────┬────────┘
                                                       │
                                       2. Preprocess   │ 5. Generate Excel
                                          & Convert    │    (.xlsx)
                                                       ▼
                                             ┌──────────────────┐
                                             │ Core Data Engine │
                                             │ (Pandas/Openpyxl)│
                                             └─────────▲────────┘
                                                       │
                                      3. Payload       │ 4. Validated
                                         (Prompt+Img)  │    JSON
                                                       ▼
                                             ┌──────────────────┐
                                             │ VLM Inference Service│
                                             │ (OpenAI/Gemini/  │
                                             │  Local LLaVA)    │
                                             └──────────────────┘
## 2.2 Sequence Flow Detail
1. **File Ingestion:** Người dùng tải file hóa đơn lên client Next.js.
2. **Preprocessing:** Backend FastAPI tiếp nhận file, thực hiện mã hóa Base64 và chuyển đổi định dạng PDF sang chuỗi hình ảnh tối ưu dung lượng (300 DPI).
3. **VLM Inference:** Backend phát thông điệp API tới mô hình VLM kèm **Structured Prompting** yêu cầu phản hồi theo schema JSON cố định.
4. **Validation Layer:** Hệ thống tự động kiểm tra cú pháp JSON trả về, đảm bảo các trường bắt buộc (Mã số thuế, Tổng tiền) không rỗng.
5. **Excel Synthesis:** Chuyển đổi dữ liệu JSON hợp lệ thành file Excel chuẩn thông qua thư viện `pandas` / `openpyxl`.
6. **Data Delivery:** Stream kết quả file `.xlsx` về giao diện người dùng để tải xuống.

---

## 3. Technical Stack
* **Frontend:** Next.js (React Framework), TypeScript, Tailwind CSS.
* **Backend:** Python 3.11, FastAPI, Pydantic v2 (Data Validation).
* **AI Core:** OpenAI API (`gpt-4o`) / Google Gemini API (`gemini-1.5-pro`) / Local VLM (LLaVA via Ollama).
* **Data Processing:** Pandas, OpenPyXL, PyMuPDF (PDF Parser).

---

## 4. VLM Integration & JSON Schema

### 4.1 System Prompt Standard
Mọi yêu cầu gửi sang VLM phải bắt buộc thực thi chế độ **JSON Output Mode** nhằm đảm bảo tính toàn vẹn dữ liệu.

### 4.2 Target Data Schema (`invoice_schema.json`)
```json
{
  "$schema": "[http://json-schema.org/draft-07/schema#](http://json-schema.org/draft-07/schema#)",
  "type": "object",
  "properties": {
    "invoice_number": { "type": "string" },
    "invoice_date": { "type": "string", "format": "date" },
    "supplier": {
      "type": "object",
      "properties": {
        "name": { "type": "string" },
        "tax_code": { "type": "string" },
        "address": { "type": "string" }
      },
      "required": ["name", "tax_code"]
    },
    "items": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "description": { "type": "string" },
          "quantity": { "type": "number" },
          "unit_price": { "type": "number" },
          "amount": { "type": "number" }
        },
        "required": ["description", "amount"]
      }
    },
    "subtotal": { "type": "number" },
    "vat_amount": { "type": "number" },
    "total_amount": { "type": "number" }
  },
  "required": ["supplier", "items", "total_amount"]
}

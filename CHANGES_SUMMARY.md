# Tóm tắt các thay đổi đã thực hiện

## 1. File mới tạo

### `src/types/contract.ts`
- Định nghĩa DTOs cho API contract:
  - `CreateContractRequestDTO` - Request khi tạo hợp đồng
  - `ApiResponse<T>` - Response wrapper từ API
  - `ContractDTO` - Dữ liệu hợp đồng trả về
  - `StaffDTO` - Dữ liệu nhân viên

### `src/services/contractService.ts`
- Service để gọi API contract
- Hỗ trợ 2 cách gửi dữ liệu:
  - JSON (khi không có file)
  - FormData (khi có file upload)
- Methods:
  - `initContract(request, files?)` - Khởi tạo hợp đồng
  - `sendJson()` - Gửi JSON
  - `sendFormData()` - Gửi FormData
  - `handleResponse()` - Xử lý response từ API

## 2. File đã sửa

### `src/components/employee/AddProbationContractForm.tsx`
**Thêm:**
- Import contractService và CreateContractRequestDTO
- State cho file upload: `uploadedFiles`
- Handler cho file upload: `handleFileUpload()`
- Handler xóa file: `handleRemoveFile()`
- Validation form toàn bộ fields
- Submit handler gọi API
- UI hiển thị error/success messages
- Phần upload file với danh sách files đã chọn
- CSS class cho uploaded files list

**Cập nhật giá trị mặc định:**
- Ngạch lương: "Ngạch 7" (disabled)
- Mức: "Mức 1" (disabled)
- % lương: "85%" (disabled)
- Mức lương: "21.500.000" (disabled)

**Sắp xếp lại form:**
- Quốc tịch và Ngày sinh: Cạnh nhau (2 cột)
- Email nhận tài khoản: Thay thế vị trí cũ của Quốc tịch

### `src/style/login.css`
- Thay đổi button login color dựa trên form state:
  - Disabled (chưa đầy đủ): #F3DDE2
  - Enabled (đầy đủ): #AE1C3F
- Sửa background-size từ "cover" → "contain"

### `src/style/employee-management.css`
**Thêm CSS cho upload file:**
- `.upload-box` - Style upload area (flex layout)
- `.upload-box input[type="file"]` - Absolute positioning, opacity 0
- `.uploaded-files-list` - Danh sách files đã upload
- `.uploaded-files-list ul` - Flex column layout
- `.uploaded-file-item` - Mỗi file item
- `.remove-file-button` - Button xóa file

### `.env.development.local`
- Thêm `REACT_APP_API_BASE_URL=http://localhost:8080/api`

## 3. Chức năng mới

### ✅ Upload tài liệu
- Chọn nhiều file cùng lúc
- Hỗ trợ: .doc, .docx, .pdf
- Hiển thị danh sách files
- Xóa file khỏi danh sách
- Validate file type

### ✅ Tích hợp API
- Gọi API `POST /api/contracts/init`
- Gửi dữ liệu + files kèm nhau
- Xử lý error và success messages
- Auto reset form sau 2 giây

### ✅ Sắp xếp form
- Quốc tịch + Ngày sinh cạnh nhau
- Thêm Email nhận tài khoản
- Giá trị mặc định cho salary fields

### ✅ Button color
- Đỏ nhạt (#F3DDE2) khi form chưa đầy đủ
- Đỏ đậm (#AE1C3F) khi form đầy đủ

## 4. Cách test

1. Chạy `npm start`
2. Điền đầy đủ thông tin form
3. Chọn tài liệu (Word/PDF)
4. Nhấn "+ Thêm mới"
5. Kiểm tra:
   - Error message nếu thiếu field
   - File upload danh sách
   - API call thành công
   - Form reset sau 2 giây

## 5. Lưu ý

- API URL: `http://localhost:8080/api` (thay đổi nếu cần)
- Branch ID hiện tại hardcoded = 1 (thay đổi nếu cần)
- Files được gửi qua FormData khi có
- Không có files thì gửi JSON thường


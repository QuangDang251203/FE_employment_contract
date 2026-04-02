# Hướng dẫn Troubleshooting

## Nếu vẫn gặp lỗi sau khi npm start

### 1. Xóa cache và cài lại
```bash
cd C:\Users\Hi\OneDrive\Documents\ReactProject\employment_contract
del /s /q node_modules
npm install
npm start
```

### 2. Nếu lỗi "Cannot find module"
Kiểm tra xem các file sau có tồn tại:
- ✓ `src/services/contractService.ts`
- ✓ `src/types/contract.ts`
- ✓ `src/components/employee/AddProbationContractForm.tsx`

### 3. Nếu lỗi TypeScript
Kiểm tra `tsconfig.json` có `strict: true` không
- Nếu có, có thể cần relax một số rules

### 4. Nếu lỗi CSS
- Kiểm tra `src/style/employee-management.css` có hợp lệ không
- Nếu IDE báo error, hãy bỏ qua vì CSS có thể có syntax khác

### 5. Nếu file upload không hoạt động
- Kiểm tra browser console có error không
- Kiểm tra API endpoint có chính xác không
- API phải support multipart/form-data

### 6. Nếu button color không thay đổi
- Kiểm tra `src/style/login.css` cú pháp CSS đúng không
- Đảm bảo `.login-button:disabled` có color #F3DDE2

## Logs quan trọng

Kiểm tra browser console (F12) xem có errors:
1. Module not found
2. Type errors
3. Network errors (API call)
4. CSS errors

## API Endpoint

Backend cần support:
```
POST /api/contracts/init
Content-Type: multipart/form-data hoặc application/json

Parameters:
- decisionNumber: string
- decisionDate: string (format: DD/MM/YYYY)
- email: string
- fullName: string
- nationality: string
- dateOfBirth: string (format: DD/MM/YYYY)
- citizenIdNumber: string
- dateIssued: string (format: DD/MM/YYYY)
- issuingLocation: string
- address: string
- levelOfTraining: string
- startDate: string (format: DD/MM/YYYY)
- endDate: string (format: DD/MM/YYYY)
- salaryRank: string
- level: string
- percentageOfSalary: number
- probationarySalary: number
- jobPosition: string
- branchId: number
- files: File[] (optional)

Response:
{
  "code": "SUCCESS",
  "message": "...",
  "data": {
    "contractCode": "...",
    ...
  }
}
```

## Kiểm tra nhanh

1. Mở Dev Tools (F12)
2. Vào tab Console
3. Chạy lệnh: `typeof contractService` → Phải là "object"
4. Nếu undefined, có lỗi import


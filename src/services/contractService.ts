import { CreateContractRequestDTO, ApiResponse, ContractDTO } from '../types/contract';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

// Helper functions
async function sendJson(request: CreateContractRequestDTO): Promise<ContractDTO> {
  const response = await fetch(`${API_BASE_URL}/contracts/init`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`,
    },
    body: JSON.stringify(request),
  });

  return handleResponse(response);
}

async function sendFormData(formData: FormData): Promise<ContractDTO> {
  const response = await fetch(`${API_BASE_URL}/contracts/init`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`,
      // Không set Content-Type, browser sẽ tự động set multipart/form-data
    },
    body: formData,
  });

  return handleResponse(response);
}

async function handleResponse(response: Response): Promise<ContractDTO> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  const data: ApiResponse<ContractDTO> = await response.json();
  
  if (data.code !== 'SUCCESS') {
    throw new Error(data.message || 'Lỗi tạo hợp đồng');
  }

  return data.data;
}

export const contractService = {
  /**
   * Khởi tạo hợp đồng thử việc
   * @param request Dữ liệu hợp đồng
   * @param files Danh sách files tải lên (tùy chọn)
   * @returns Promise<ContractDTO>
   */
  async initContract(request: CreateContractRequestDTO, files?: File[]): Promise<ContractDTO> {
    try {
      // Convert display dates (dd/MM/yyyy) to ISO format (yyyy-MM-dd) for API
      const apiRequest = {
        ...request,
        decisionDate: convertToIsoDate(request.decisionDate),
        dateOfBirth: convertToIsoDate(request.dateOfBirth),
        dateIssued: convertToIsoDate(request.dateIssued),
        startDate: convertToIsoDate(request.startDate),
        endDate: convertToIsoDate(request.endDate),
      };

      // Nếu có files, sử dụng FormData (multipart/form-data endpoint)
      if (files && files.length > 0) {
        const formData = new FormData();
        
        // Thêm request object dưới dạng Blob JSON trong field "contract"
        // Điều quan trọng: Blob sẽ có Content-Type: application/json
        // String JSON sẽ có Content-Type: text/plain (Spring không deserialize được)
        const contractBlob = new Blob([JSON.stringify(apiRequest)], { type: 'application/json' });
        formData.append('contract', contractBlob, 'contract.json');
        
        // Thêm files vào field "attachments"
        files.forEach((file) => {
          formData.append('attachments', file);
        });

        return sendFormData(formData);
      } else {
        // Không có files, sử dụng JSON endpoint
        return sendJson(apiRequest);
      }
    } catch (error) {
      console.error('Error calling initContract API:', error);
      throw error;
    }
  },
};

// Helper function to convert display date format (dd/MM/yyyy) to ISO format (yyyy-MM-dd)
function convertToIsoDate(displayDate: string): string {
  if (!displayDate) {
    return '';
  }

  // If already in ISO format, return as is
  if (/^\d{4}-\d{2}-\d{2}$/.test(displayDate)) {
    return displayDate;
  }

  // Convert from dd/MM/yyyy to yyyy-MM-dd
  const parts = displayDate.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!parts) {
    return displayDate;
  }

  const [, day, month, year] = parts;
  return `${year}-${month}-${day}`;
}


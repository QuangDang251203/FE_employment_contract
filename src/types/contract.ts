// Request DTOs
export interface CreateContractRequestDTO {
  decisionNumber: string;
  decisionDate: string;
  email: string;
  fullName: string;
  nationality: string;
  dateOfBirth: string;
  citizenIdNumber: string;
  soCCCD: string;
  dateIssued: string;
  issuingLocation: string;
  address: string;
  levelOfTraining: string;
  startDate: string;
  endDate: string;
  salaryRank: string;
  level: string;
  percentageOfSalary: number;
  probationarySalary: number;
  jobPosition: string;
  branchId: number;
}

// Response DTOs
export interface ApiResponse<T> {
  code: string;
  message: string;
  data: T;
  timestamp: string;
}

export interface ContractDTO {
  contractCode: string;
  decisionNumber: string;
  decisionDate: string;
  email: string;
  startDate: string;
  endDate: string;
  status: string;
  branchId: number;
  level: string;
  salaryRank: string;
  percentageOfSalary: number;
  probationarySalary: number;
  createAt: string;
  staff: StaffDTO;
}

export interface StaffDTO {
  id: number;
  fullName: string;
  dateOfBirth: string;
  nationality: string;
  citizenIdNumber: string;
  dateIssued: string;
  issuingLocation: string;
  address: string;
  levelOfTraining: string;
}


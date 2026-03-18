export type ContractStatus = 'pending' | 'completed' | 'cancelled';

export interface SidebarMenuItem {
  id: string;
  label: string;
  active?: boolean;
  expanded?: boolean;
  children?: SidebarMenuItem[];
}

export interface UnitItem {
  id: string;
  name: string;
}

export interface ContractItem {
  id: number;
  contractCode: string;
  fullName: string;
  employeeCode: string;
  birthDate: string;
  address: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  unit: string;
  unitCode: string;
  status: ContractStatus;
}


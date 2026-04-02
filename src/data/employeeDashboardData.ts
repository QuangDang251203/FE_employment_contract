import { ContractItem, SidebarMenuItem, UnitItem } from '../types/employee';

export const sidebarMenu: SidebarMenuItem[] = [
  { id: 'home', label: 'Trang chủ' },
  { id: 'personal', label: 'Khách hàng cá nhân' },
  { id: 'business', label: 'Khách hàng doanh nghiệp' },
  {
    id: 'hr',
    label: 'Quản lý nhân sự',
    active: true,
    children: [
      { id: 'probation', label: 'Hợp đồng thử việc', active: true },
      { id: 'labor', label: 'Hợp đồng lao động' }
    ]
  },
  { id: 'documents', label: 'Quản lý văn bản' },
  { id: 'templates', label: 'Kho hợp đồng mẫu' },
  { id: 'settings', label: 'Cấu hình chung' }
];

export const units: UnitItem[] = [
  { id: 'all', name: 'Tất cả' },
  { id: '1', name: 'Trụ sở chính' },
  { id: '2', name: 'Chi nhánh Sở giao dịch' },
  { id: '3', name: 'Chi nhánh Hà Nội' },
  { id: '4', name: 'Chi nhánh Đà Nẵng' },
  { id: '5', name: 'Chi nhánh Hải Phòng' },
  { id: '6', name: 'Chi nhánh Thủ Đức' },
  { id: '7', name: 'Chi nhánh Ba Đình' },
  { id: '8', name: 'Chi nhánh Đống Đa' },
  { id: '9', name: 'Chi nhánh Bình Chánh' }
];

export const contracts: ContractItem[] = [
  {
    id: 1,
    contractCode: '00121451239',
    fullName: 'Trần Quốc Chiến',
    employeeCode: '001098123299',
    birthDate: '07/12/1991',
    address: 'Số 34 đường Tôn Đức Thắng, Quận 1, TP. Hồ Chí Minh',
    startDate: '01/01/2026',
    endDate: '01/03/2026',
    createdAt: '08:34:16 08/02/2026',
    unit: 'Chi nhánh Ba Đình',
    unitCode: 'E000002',
    status: 'pending'
  },
  {
    id: 2,
    contractCode: '001202049292',
    fullName: 'Nguyễn Đình Kiên',
    employeeCode: '001098123299',
    birthDate: '03/10/1997',
    address: 'Đường Phước Thiện, Quận 9, TP. Thủ Đức',
    startDate: '01/01/2026',
    endDate: '01/03/2026',
    createdAt: '08:34:16 08/02/2026',
    unit: 'Chi nhánh Đống Đa',
    unitCode: 'E000002',
    status: 'completed'
  },
  {
    id: 3,
    contractCode: '438290781921',
    fullName: 'Phạm Thị Huyền Nga',
    employeeCode: '001098123299',
    birthDate: '25/07/1990',
    address: 'Đường Nguyễn Xiển, Quận 9 - TP. Thủ Đức',
    startDate: '01/01/2026',
    endDate: '01/03/2026',
    createdAt: '08:34:16 08/02/2026',
    unit: 'Chi nhánh Ba Đình',
    unitCode: 'E000002',
    status: 'pending'
  },
  {
    id: 4,
    contractCode: '659408920372',
    fullName: 'Chử Việt Hoàng',
    employeeCode: '001098123299',
    birthDate: '30/09/2012',
    address: '177 Xa lộ Hà Nội, Quận 2 - TP. Thủ Đức',
    startDate: '01/01/2026',
    endDate: '01/03/2026',
    createdAt: '08:34:16 08/02/2026',
    unit: 'Chi nhánh Đông Anh',
    unitCode: 'E000002',
    status: 'completed'
  },
  {
    id: 5,
    contractCode: '182903819027',
    fullName: 'La Mạnh Toàn',
    employeeCode: '001098123299',
    birthDate: '09/12/1998',
    address: 'Số 19 đường Trần Văn Trà, Quận 7, TP. Hồ Chí Minh',
    startDate: '01/01/2026',
    endDate: '01/03/2026',
    createdAt: '08:34:16 08/02/2026',
    unit: 'Chi nhánh Ba Đình',
    unitCode: 'E000002',
    status: 'pending'
  },
  {
    id: 6,
    contractCode: '328190321892',
    fullName: 'Phạm Văn Minh',
    employeeCode: '001098123299',
    birthDate: '19/06/1992',
    address: 'Đường số 1, Quận Thủ Đức - TP. Thủ Đức',
    startDate: '01/01/2026',
    endDate: '01/03/2026',
    createdAt: '08:34:16 08/02/2026',
    unit: 'Chi nhánh Thủ Đức',
    unitCode: 'E000002',
    status: 'completed'
  },
  {
    id: 7,
    contractCode: '908594072839',
    fullName: 'Dương Vĩnh Khánh',
    employeeCode: '001098123299',
    birthDate: '25/03/1999',
    address: '158 An Dương Vương, phường An Lạc, Quận Bình Tân',
    startDate: '01/01/2026',
    endDate: '01/03/2026',
    createdAt: '08:34:16 08/02/2026',
    unit: 'Chi nhánh Ba Đình',
    unitCode: 'E000002',
    status: 'cancelled'
  },
  {
    id: 8,
    contractCode: '849320432922',
    fullName: 'Trần Trung Hiếu',
    employeeCode: '001098123299',
    birthDate: '04/09/2001',
    address: '380 Đường Song Hành, Huyện Hóc Môn, TP. Hồ Chí Minh',
    startDate: '01/01/2026',
    endDate: '01/03/2026',
    createdAt: '08:34:16 08/02/2026',
    unit: 'Chi nhánh Hóc Môn',
    unitCode: 'E000002',
    status: 'completed'
  },
  {
    id: 9,
    contractCode: '128392017832',
    fullName: 'Ngô Hà Châu',
    employeeCode: '001098123299',
    birthDate: '14/02/1990',
    address: 'Đường Nguyễn Văn Linh, Huyện Bình Chánh',
    startDate: '01/01/2026',
    endDate: '01/03/2026',
    createdAt: '08:34:16 08/02/2026',
    unit: 'Chi nhánh Bình Chánh',
    unitCode: 'E000002',
    status: 'cancelled'
  }
];


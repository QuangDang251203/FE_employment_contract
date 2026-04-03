import React, { useRef, useState, useEffect } from 'react';
import '../../style/employee-management.css';
import ViewContractDetail from './ViewContractDetail';
import approveIcon from '../../assets/icon_action_with_contract/clipboard-tick.png';
import rejectIcon from '../../assets/icon_action_with_contract/clipboard-close.png';
import stampImg from '../../assets/stamp/Stamp.png';

interface Staff {
  id: number;
  fullName: string;
  dateOfBirth: string;
  address: string;
  dateIssued: string;
  soCCCD: string;
  issuingLocation: string;
  levelOfTraining: string;
  branchId: number;
  email: string;
  username: string;
}

interface ContractData {
  contractCode: string;
  decisionNumber: string;
  decisionDate: string;
  email: string;
  startDate: string;
  endDate: string;
  status: 'PENDING_SIGN' | 'COMPLETED' | 'STAMPED' | 'REJECTED' | '3';
  branchId: number;
  branchName: string;
  jobPosition: string;
  level: string;
  salaryRank: string;
  percentageOfSalary: number;
  probationarySalary: number;
  createAt: string;
  staff: Staff;
}

type ContractStatus = 'pending' | 'completed' | 'stamped' | 'cancelled';

const statusMapping: Record<string, ContractStatus> = {
  'PENDING_SIGN': 'pending',
  'COMPLETED': 'completed',
  'STAMPED': 'stamped',
  '3': 'stamped',
  'REJECTED': 'cancelled'
};

const statusLabel: Record<ContractStatus, string> = {
  pending: 'Chờ ký',
  completed: 'Chờ duyệt',
  stamped: 'Đã duyệt',
  cancelled: 'Đã hủy'
};

const statusClassName: Record<ContractStatus, string> = {
  pending: 'status-pending',
  completed: 'status-completed',
  stamped: 'status-stamped',
  cancelled: 'status-cancelled'
};

interface ContractTableProps {
  onAddNew: () => void;
  onViewContract: (contractCode: string) => void;
  selectedBranchId?: string | number;
}

function SearchFilterInput({ placeholder }: { placeholder: string }) {
  return (
    <div className="filter-input-wrapper">
      <input type="text" placeholder={placeholder} />
      <span className="filter-icon" aria-hidden="true">
        <svg viewBox="0 0 20 20" fill="none">
          <circle cx="9" cy="9" r="5.5" stroke="currentColor" strokeWidth="1.6" />
          <path d="M13.2 13.2L17 17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </span>
    </div>
  );
}

function DateFilterInput({ placeholder }: { placeholder: string }) {
  const dateInputRef = useRef<HTMLInputElement>(null);
  const [displayValue, setDisplayValue] = useState('');

  const openPicker = () => {
    const dateElement = dateInputRef.current;
    if (!dateElement) {
      return;
    }

    const pickerCapableElement = dateElement as HTMLInputElement & {
      showPicker?: () => void;
    };

    if (typeof pickerCapableElement.showPicker === 'function') {
      pickerCapableElement.showPicker();
      return;
    }

    dateElement.focus();
    dateElement.click();
  };

  const handleDateChange = (value: string) => {
    if (!value) {
      setDisplayValue('');
      return;
    }

    const [year, month, day] = value.split('-');
    setDisplayValue(`${day}/${month}/${year}`);
  };

  return (
    <div className="filter-input-wrapper">
      <input type="text" placeholder={placeholder} value={displayValue} readOnly onClick={openPicker} />
      <button type="button" className="filter-icon-button" onClick={openPicker} aria-label="Mở lịch">
        <svg viewBox="0 0 20 20" fill="none">
          <rect x="3" y="4.5" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
          <path d="M6 3v3M14 3v3M3 8h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
      <input
        ref={dateInputRef}
        className="hidden-date-input"
        type="date"
        onChange={(event) => handleDateChange(event.target.value)}
        tabIndex={-1}
        aria-hidden="true"
      />
    </div>
  );
}

function ContractTable({ onAddNew, onViewContract, selectedBranchId = 'all' }: ContractTableProps) {
  const [contracts, setContracts] = useState<ContractData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [stampingContractCode, setStampingContractCode] = useState<string | null>(null);
  const [confirmContractCode, setConfirmContractCode] = useState<string | null>(null);
  const [showStampAnimation, setShowStampAnimation] = useState(false);

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        setLoading(true);
        setError('');

        // If "Tất cả" is selected, fetch all contracts
        if (selectedBranchId === 'all') {
          const response = await fetch('http://localhost:8080/api/contracts/getAllContract');
          if (!response.ok) {
            throw new Error('Failed to fetch contracts');
          }
          const apiResponse = await response.json();
          const contractList = apiResponse.data || [];
          setContracts(contractList);
        } else {
          // Fetch contracts for specific branch
          const response = await fetch(`http://localhost:8080/api/contracts/branch/${selectedBranchId}`);
          if (!response.ok) {
            throw new Error('Failed to fetch contracts');
          }
          const apiResponse = await response.json();
          const contractList = apiResponse.data || [];
          setContracts(contractList);
        }
      } catch (err) {
        console.error('Error fetching contracts:', err);
        setError('Không thể tải danh sách hợp đồng');
        setContracts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchContracts();
  }, [selectedBranchId]);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const formatDateTime = (dateTimeString: string) => {
    if (!dateTimeString) return '';
    const date = new Date(dateTimeString);
    return date.toLocaleDateString('vi-VN');
  };

  const handleStampContract = async (e: React.MouseEvent, contractCode: string) => {
    e.stopPropagation();
    setConfirmContractCode(contractCode);
  };

  const executeStampContract = async () => {
    if (!confirmContractCode) return;
    
    setStampingContractCode(confirmContractCode);
    try {
      const response = await fetch(`http://localhost:8080/api/contracts/stamp/${confirmContractCode}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to stamp contract');
      }

      const result = await response.json();
      if (result.code === 'SUCCESS') {
        const stampedCode = confirmContractCode;
        setConfirmContractCode(null);
        setShowStampAnimation(true);
        setTimeout(() => {
          setShowStampAnimation(false);
          // Refresh the contracts list
          setContracts(prevContracts =>
            prevContracts.map(contract =>
              contract.contractCode === stampedCode
                ? { ...contract, status: 'STAMPED' as const }
                : contract
            )
          );
        }, 1500);
      } else {
        throw new Error(result.message || 'Failed to stamp contract');
      }
    } catch (err) {
      console.error('Error stamping contract:', err);
      alert('Lỗi phê duyệt hợp đồng: ' + (err instanceof Error ? err.message : 'Unknown error'));
      setConfirmContractCode(null);
    } finally {
      setStampingContractCode(null);
    }
  };

  const handleRejectContract = (e: React.MouseEvent, _contractCode: string) => {
    e.stopPropagation();
    alert('Chức năng từ chối đang được phát triển');
  };

  return (
    <section className="panel contract-panel" aria-label="Danh sách hợp đồng thử việc">
      <header className="panel-header panel-header-actions">
        <h2>Danh sách hợp đồng thử việc</h2>
        <div className="table-actions">
          <button type="button" className="btn btn-primary" onClick={onAddNew}>
            + Thêm mới
          </button>
          <button type="button" className="btn btn-ghost btn-with-icon">
            <span className="btn-icon-inline" aria-hidden="true">
              <svg viewBox="0 0 16 16" fill="none">
                <path d="M8 11.2V3.8m0 0L5.6 6.2M8 3.8l2.4 2.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3.3 3.2h9.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </span>
            <span>Tải lên</span>
          </button>
          <button type="button" className="btn btn-ghost btn-with-icon">
            <span className="btn-icon-inline" aria-hidden="true">
              <svg viewBox="0 0 16 16" fill="none">
                <path d="M8 2.8v7.4m0 0l-2.4-2.4M8 10.2l2.4-2.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3.3 12.2h9.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </span>
            <span>Tải xuống</span>
          </button>
          <button type="button" className="btn btn-icon" aria-label="Thêm tùy chọn">
            ...
          </button>
        </div>
      </header>

      <div className="contract-table-wrapper">
        {loading ? (
          <div style={{ padding: '32px', textAlign: 'center', color: '#999' }}>
            Đang tải dữ liệu...
          </div>
        ) : error ? (
          <div style={{ padding: '32px', textAlign: 'center', color: '#d32f2f' }}>
            {error}
          </div>
        ) : (
          <table className="contract-table">
            <thead>
              <tr>
                <th className="col-stt">STT</th>
                <th className="col-contract">Mã hợp đồng</th>
                <th className="col-name">Họ và tên</th>
                <th className="col-birth">Ngày sinh</th>
                <th className="col-address">Địa chỉ thường trú</th>
                <th className="col-start-date">Ngày bắt đầu</th>
                <th className="col-end-date">Ngày kết thúc</th>
                <th className="col-created">Thời gian tạo</th>
                <th className="col-unit">Đơn vị</th>
                <th className="col-status">Trạng thái</th>
                <th className="col-action">Hành động</th>
              </tr>
              <tr className="filter-row">
                <th className="col-stt" />
                <th className="col-contract">
                  <SearchFilterInput placeholder="Tìm kiếm" />
                </th>
                <th className="col-name">
                  <SearchFilterInput placeholder="Tìm kiếm" />
                </th>
                <th className="col-birth">
                  <DateFilterInput placeholder="Chọn thời gian" />
                </th>
                <th className="col-address">
                  <SearchFilterInput placeholder="Tìm kiếm" />
                </th>
                <th className="col-start-date">
                  <DateFilterInput placeholder="Chọn thời gian" />
                </th>
                <th className="col-end-date">
                  <DateFilterInput placeholder="Chọn thời gian" />
                </th>
                <th className="col-created">
                  <DateFilterInput placeholder="Chọn thời gian" />
                </th>
                <th className="col-unit">
                  <input type="text" placeholder="Chọn đơn vị" />
                </th>
                <th className="col-status">
                  <input type="text" placeholder="Thời hạn" />
                </th>
                <th className="col-action" />
              </tr>
            </thead>
            <tbody>
              {contracts.map((contract, index) => {
                const status = statusMapping[contract.status] || 'pending';
                const staff = contract.staff;
                
                // Skip rendering if staff is undefined or null
                if (!staff) {
                  return null;
                }
                
                return (
                  <tr 
                    key={contract.contractCode} 
                    className="contract-table-row"
                    onClick={() => onViewContract(contract.contractCode)} 
                    style={{ cursor: 'pointer' }}
                  >
                    <td className="col-stt">{index + 1}</td>
                    <td className="col-contract">{contract.contractCode}</td>
                    <td className="col-name">
                      <div className="primary-text">{staff.fullName || 'N/A'}</div>
                      <span className="meta-row sub-text">
                        <svg className="meta-icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                          <rect x="2.2" y="3" width="11.6" height="10" rx="2" stroke="currentColor" strokeWidth="1.4" />
                          <path d="M5 6.2h6M5 8.2h4.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                        </svg>
                        <span>{staff.soCCCD || staff.id || 'N/A'}</span>
                      </span>
                    </td>
                    <td className="col-birth">{formatDate(staff.dateOfBirth)}</td>
                    <td className="col-address address-cell">{staff.address}</td>
                    <td className="col-start-date">{formatDate(contract.startDate)}</td>
                    <td className="col-end-date">{formatDate(contract.endDate)}</td>
                    <td className="col-created">{formatDateTime(contract.createAt)}</td>
                    <td className="col-unit">
                      <div className="primary-text">{contract.branchName}</div>
                      <span className="meta-row sub-text">
                        <svg className="meta-icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                          <path
                            d="M2.6 12.8h10.8M3.6 12.8V6.3M12.4 12.8V6.3M5.9 12.8V8.3M10.1 12.8V8.3M2.6 6.3l5.4-3.1 5.4 3.1"
                            stroke="currentColor"
                            strokeWidth="1.3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span>{contract.jobPosition || 'N/A'}</span>
                      </span>
                    </td>
                    <td className="col-status">
                      <span className={`status-pill ${statusClassName[status]}`}>{statusLabel[status]}</span>
                    </td>
                    <td className="col-action">
                      {status === 'completed' && (
                        <>
                          <button 
                            type="button" 
                            className="table-icon-btn" 
                            onClick={(e) => handleStampContract(e, contract.contractCode)}
                            disabled={stampingContractCode === contract.contractCode}
                            aria-label={`Phê duyệt hợp đồng ${contract.contractCode}`}
                            title="Phê duyệt"
                          >
                            <img src={approveIcon} alt="Phê duyệt" className="action-icon" />
                          </button>
                          <button 
                            type="button" 
                            className="table-icon-btn danger" 
                            onClick={(e) => handleRejectContract(e, contract.contractCode)}
                            aria-label={`Từ chối hợp đồng ${contract.contractCode}`}
                            title="Từ chối"
                          >
                            <img src={rejectIcon} alt="Từ chối" className="action-icon" />
                          </button>
                        </>
                      )}
                      {status === 'pending' && (
                        <button 
                          type="button" 
                          className="table-icon-btn danger" 
                          onClick={(e) => handleRejectContract(e, contract.contractCode)}
                          aria-label={`Từ chối hợp đồng ${contract.contractCode}`}
                          title="Từ chối"
                        >
                          <img src={rejectIcon} alt="Từ chối" className="action-icon" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {!loading && contracts.length > 0 && (
        <footer className="table-footer">
          <p>Hiển thị 1 - {contracts.length} trên {contracts.length} bản ghi</p>
          <div className="pagination">
            <button type="button">&lt;</button>
            <button type="button" className="active">
              1
            </button>
            <button type="button">&gt;</button>
          </div>
        </footer>
      )}

      {confirmContractCode && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 2000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ background: 'white', padding: '24px', borderRadius: '8px', width: '400px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
            <h3 style={{ margin: '0 0 16px', color: '#1f2a44' }}>Xác nhận phê duyệt</h3>
            <p style={{ margin: '0 0 24px', color: '#4f5f77', lineHeight: '1.5' }}>Bạn có chắc chắn muốn phê duyệt hợp đồng <strong>{confirmContractCode}</strong>? Hành động này sẽ đóng dấu và phát hành hợp đồng chính thức.</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button 
                onClick={() => setConfirmContractCode(null)}
                style={{ padding: '8px 16px', border: '1px solid #eaebef', background: '#fff', borderRadius: '6px', cursor: 'pointer', color: '#4f5f77', fontWeight: 500 }}
                disabled={!!stampingContractCode}
              >
                Hủy
              </button>
              <button 
                onClick={executeStampContract}
                style={{ padding: '8px 16px', border: 'none', background: '#2e7d32', borderRadius: '6px', cursor: 'pointer', color: '#fff', fontWeight: 500 }}
                disabled={!!stampingContractCode}
              >
                {stampingContractCode ? 'Đang xử lý...' : 'Xác nhận phê duyệt'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showStampAnimation && (
        <div style={{ 
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 3000, 
          display: 'flex', justifyContent: 'center', alignItems: 'center' 
        }}>
          <img 
            src={stampImg} 
            alt="Đã đóng dấu" 
            style={{ 
              width: '250px', 
              animation: 'stampIn 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards' 
            }} 
          />
          <style>
            {`
              @keyframes stampIn {
                0% { transform: scale(3) rotate(15deg); opacity: 0; }
                50% { transform: scale(1) rotate(-5deg); opacity: 1; }
                100% { transform: scale(1) rotate(0deg); opacity: 1; }
              }
            `}
          </style>
        </div>
      )}
    </section>
  );
}

export default ContractTable;

import React, { useRef, useState } from 'react';
import { contracts } from '../../data/employeeDashboardData';
import { ContractStatus } from '../../types/employee';

const statusLabel: Record<ContractStatus, string> = {
  pending: 'Chờ ký',
  completed: 'Hoàn thành',
  cancelled: 'Đã hủy'
};

const statusClassName: Record<ContractStatus, string> = {
  pending: 'status-pending',
  completed: 'status-completed',
  cancelled: 'status-cancelled'
};

interface ContractTableProps {
  onAddNew: () => void;
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

function ContractTable({ onAddNew }: ContractTableProps) {
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
            {contracts.map((contract) => (
              <tr key={contract.id}>
                <td className="col-stt">{contract.id}</td>
                <td className="col-contract">{contract.contractCode}</td>
                <td className="col-name">
                  <div className="primary-text">{contract.fullName}</div>
                  <span className="meta-row sub-text">
                    <svg className="meta-icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <rect x="2.2" y="3" width="11.6" height="10" rx="2" stroke="currentColor" strokeWidth="1.4" />
                      <path d="M5 6.2h6M5 8.2h4.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                    </svg>
                    <span>{contract.employeeCode}</span>
                  </span>
                </td>
                <td className="col-birth">{contract.birthDate}</td>
                <td className="col-address address-cell">{contract.address}</td>
                <td className="col-start-date">{contract.startDate}</td>
                <td className="col-end-date">{contract.endDate}</td>
                <td className="col-created">{contract.createdAt}</td>
                <td className="col-unit">
                  <div className="primary-text">{contract.unit}</div>
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
                    <span>{contract.unitCode}</span>
                  </span>
                </td>
                <td className="col-status">
                  <span className={`status-pill ${statusClassName[contract.status]}`}>{statusLabel[contract.status]}</span>
                </td>
                <td className="col-action">
                  <button type="button" className="table-eye" aria-label={`Xem hợp đồng ${contract.contractCode}`}>
                    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                      <path
                        d="M2.3 10c1.8-3.1 4.6-4.7 7.7-4.7s5.9 1.6 7.7 4.7c-1.8 3.1-4.6 4.7-7.7 4.7S4.1 13.1 2.3 10z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <circle cx="10" cy="10" r="2.2" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <footer className="table-footer">
        <p>Hiển thị 1 - 20 trên 1200 bản ghi</p>
        <div className="pagination">
          <button type="button">&lt;</button>
          <button type="button" className="active">
            6
          </button>
          <button type="button">7</button>
          <button type="button">8</button>
          <button type="button">&gt;</button>
        </div>
      </footer>
    </section>
  );
}

export default ContractTable;
export { ContractTable };

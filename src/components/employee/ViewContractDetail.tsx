import React, { useRef, useState, useEffect } from 'react';
import { branchService, Branch } from '../../services/branchService';
import stampImg from '../../assets/stamp/Stamp.png';

interface ViewContractDetailProps {
  contractCode: string;
  onBack: () => void;
}

interface ProcessFileDTO {
  id: number;
  fileType: 'GENERATED_PDF' | 'SIGNED_PDF' | 'STAMPED_PDF';
  signAt: string;
}

function toDisplayDate(value: string): string {
  if (!value) {
    return '';
  }

  if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
    return value;
  }

  const parts = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!parts) {
    return value;
  }

  const [, day, month, year] = parts;
  return `${year}-${month}-${day}`;
}

function formatDateTimeVN(isoString: string): string {
  if (!isoString) return '';
  const date = new Date(isoString);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${hours}:${minutes} ${day}/${month}/${year}`;
}

interface DateInputWithPickerProps {
  placeholder: string;
  ariaLabel: string;
  value: string;
  onChange: (nextValue: string) => void;
  disabled?: boolean;
}

function DateInputWithPicker({ placeholder, ariaLabel, value, onChange, disabled = true }: DateInputWithPickerProps) {
  return (
    <div className="date-input-wrapper">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label={ariaLabel}
        disabled={disabled}
        readOnly={disabled}
      />
      <button type="button" className="date-picker-button" disabled={disabled} aria-label={`Mở lịch ${ariaLabel}`}>
        <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <rect x="3" y="4.5" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
          <path d="M6 3v3M14 3v3M3 8h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}

function ViewContractDetail({ contractCode, onBack }: ViewContractDetailProps) {
  // Contract info
  const [decisionNumber, setDecisionNumber] = useState('');
  const [decisionDate, setDecisionDate] = useState('');
  const [contractStatus, setContractStatus] = useState('');
  
  // Employee info
  const [fullName, setFullName] = useState('');
  const [accountEmail, setAccountEmail] = useState('');
  const [nationality, setNationality] = useState('Việt Nam'); // Defaults as API doesn't return nationality
  const [dateOfBirth, setBirthDate] = useState('');
  const [citizenIdNumber, setCitizenIdNumber] = useState('');
  const [dateIssued, setIssueDate] = useState('');
  const [issuingLocation, setIssuingLocation] = useState('');
  const [address, setAddress] = useState('');
  const [levelOfTraining, setLevelOfTraining] = useState('');
  
  // Documents
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);

  // Contract terms
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [probationDays, setProbationDays] = useState('');
  const [workLocationName, setWorkLocationName] = useState('');
  const [jobPosition, setJobPosition] = useState<string | number>('');
  
  // Salary info
  const [salaryGrade, setSalaryGrade] = useState('Ngạch 7');
  const [salaryStep, setSalaryStep] = useState('Mức 1');
  const [percentageOfSalary, setPercentageOfSalary] = useState('85');
  const [probationarySalary, setProbationarySalary] = useState('21.500.000');
  
  // UI states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewingPdfUrl, setViewingPdfUrl] = useState<string | null>(null);
  const [showConfirmStampModal, setShowConfirmStampModal] = useState(false);
  const [isStamping, setIsStamping] = useState(false);
  const [showStampAnimation, setShowStampAnimation] = useState(false);
  
  // Timeline process files
  const [processFiles, setProcessFiles] = useState<ProcessFileDTO[]>([]);

  // Fetch contract details
  useEffect(() => {
    const fetchContractDetails = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`http://localhost:8080/api/contracts/${contractCode}`);
        if (!response.ok) {
          throw new Error('Failed to fetch contract details');
        }
        const data = await response.json();
        const contract = data.data;

        setContractStatus(contract.status || '');

        // Populate form with contract data based on the API response structure provided
        setDecisionNumber(contract.decisionNumber || '');
        setDecisionDate(toDisplayDate(contract.decisionDate || ''));
        setFullName(contract.staffFullName || '');
        setAccountEmail(contract.email || '');
        setBirthDate(toDisplayDate(contract.dateOfBirth || ''));
        setCitizenIdNumber(contract.soCCCD || '');
        setIssueDate(toDisplayDate(contract.dateIssued || ''));
        setIssuingLocation(contract.issuingLocation || '');
        setAddress(contract.address || '');
        setLevelOfTraining(contract.levelOfTraining || '');
        setStartDate(toDisplayDate(contract.startDate || ''));
        setEndDate(toDisplayDate(contract.endDate || ''));
        setProbationDays(contract.probationDays ? contract.probationDays.toString() : '');
        setWorkLocationName(contract.branchName || '');
        setJobPosition(contract.jobPosition || '');
        setSalaryGrade(contract.salaryRank || 'Ngạch 7');
        setSalaryStep(contract.level || 'Mức 1');
        setPercentageOfSalary(contract.percentageOfSalary?.toString() || '85');
        
        if (contract.staffDocuments && Array.isArray(contract.staffDocuments)) {
          setUploadedFiles(contract.staffDocuments);
        }

        setProbationarySalary(formatSalary(contract.probationarySalary));
      } catch (err) {
        console.error('Error fetching contract details:', err);
        setError('Lỗi tải chi tiết hợp đồng');
      } finally {
        setIsLoading(false);
      }
    };

    const fetchProcessFiles = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/contracts/${contractCode}/process-files`);
        if (response.ok) {
          const data = await response.json();
          setProcessFiles(data.data || []);
        }
      } catch (err) {
        console.error('Error fetching process files:', err);
      }
    };

    fetchContractDetails();
    fetchProcessFiles();
  }, [contractCode]);

    function formatSalary(salary: number | string): string {
    if (!salary) return '';
    const num = typeof salary === 'string' ? parseFloat(salary) : salary;
    // Format to local string with commas, e.g., 21.500.000
    return num.toLocaleString('vi-VN');
    }

    const handleConfirmStamp = async () => {
    setIsStamping(true);
    try {
      const response = await fetch(`http://localhost:8080/api/contracts/stamp/${contractCode}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`,
        },
      });

      if (!response.ok) {
        throw new Error('Stamp failed');
      }

      const result = await response.json();
      if (result.code === 'SUCCESS') {
        setShowConfirmStampModal(false);
        setShowStampAnimation(true);
        setTimeout(() => {
          setShowStampAnimation(false);
          setContractStatus('STAMPED');
          // Re-fetch process files to update timeline
          fetch(`http://localhost:8080/api/contracts/${contractCode}/process-files`)
            .then(res => res.json())
            .then(data => setProcessFiles(data.data || []));
        }, 1500); // Animation duration
      }
    } catch (err) {
      console.error('Error stamping contract:', err);
      alert('Có lỗi xảy ra khi phê duyệt hợp đồng.');
    } finally {
      setIsStamping(false);
    }
    };

    if (isLoading) {
    return (
      <section className="create-contract-page" aria-label="Chi tiết hợp đồng">
        <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
          Đang tải chi tiết hợp đồng...
        </div>
      </section>
    );
    }

  return (
    <section className="create-contract-page" aria-label="Chi tiết hợp đồng thử việc">
      <header className="create-contract-topbar">
        <button type="button" className="back-button" onClick={onBack}>
          <span className="back-button-icon" aria-hidden="true">
            <svg viewBox="0 0 16 16" fill="none">
              <path d="M9.8 3.5L5.2 8l4.6 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span>Chi tiết hợp đồng - {contractCode}</span>
        </button>
        <div className="create-actions" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Compact Timeline */}
          <div style={{ display: 'flex', alignItems: 'center', background: '#fff', padding: '6px 16px', borderRadius: '8px', border: '1px solid #eaebef', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            {[
              { key: 'GENERATED_PDF', label: 'Tạo HĐ' },
              { key: 'SIGNED_PDF', label: 'Ký' },
              { key: 'STAMPED_PDF', label: 'Duyệt' }
            ].map((step, index, arr) => {
              const file = processFiles.find(f => f.fileType === step.key);
              const isCompleted = !!file;
              const nextFile = index < arr.length - 1 ? processFiles.find(f => f.fileType === arr[index + 1].key) : null;
              
              return (
                <React.Fragment key={step.key}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ 
                        width: '18px', height: '18px', borderRadius: '50%', 
                        background: isCompleted ? '#2e7d32' : '#fff',
                        border: isCompleted ? '1px solid #2e7d32' : '1px solid #ffcdd2',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: isCompleted ? '#fff' : '#d32f2f', fontSize: '10px', fontWeight: 'bold'
                      }}>
                        {isCompleted ? '✓' : (index + 1)}
                      </div>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: isCompleted ? '#2e7d32' : '#7a8498' }}>{step.label}</span>
                    </div>
                    {isCompleted && (
                      <span style={{ fontSize: '10px', color: '#7a8498', marginTop: '2px' }}>
                        {formatDateTimeVN(file.signAt)}
                      </span>
                    )}
                  </div>
                  {index < arr.length - 1 && (
                    <div style={{ width: '24px', height: '2px', background: nextFile ? '#2e7d32' : '#ffebee', margin: '0 8px' }} />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          <button 
            type="button" 
            className="btn btn-ghost btn-with-icon"
            onClick={() => setViewingPdfUrl(`http://localhost:8080/api/contracts/${contractCode}/staff-view`)}
          >
            <span className="btn-icon-inline" aria-hidden="true">
              <svg viewBox="0 0 16 16" fill="none">
                <path
                  d="M2.4 8c1.4-2.5 3.5-3.8 5.6-3.8S12.2 5.5 13.6 8c-1.4 2.5-3.5 3.8-5.6 3.8S3.8 10.5 2.4 8z"
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
                <circle cx="8" cy="8" r="1.8" stroke="currentColor" strokeWidth="1.4" />
              </svg>
            </span>
            <span>Xem File Ký Gốc</span>
          </button>

          {contractStatus === 'COMPLETED' && (
            <button 
              type="button" 
              className="btn btn-primary"
              onClick={() => setShowConfirmStampModal(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#2e7d32', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
            >
              Phê duyệt
            </button>
          )}
        </div>
      </header>

      <div className="create-contract-grid">
        <div className="panel create-main-panel">
          <header className="panel-header">
            <h2>Thông tin hợp đồng</h2>
          </header>

          <div className="form-section">
            <h3>Thông tin hợp đồng</h3>
            {error && (
              <div className="error-message" style={{ marginBottom: '20px', padding: '12px', backgroundColor: '#fff2f0', border: '1px solid #ffccc7', borderRadius: '6px', color: '#d9534f', fontSize: '14px' }}>
                {error}
              </div>
            )}
            <div className="form-grid two-columns">
              <label>
                <span>Căn cứ quyết định số</span>
                <div className="inline-field">
                  <input 
                    type="text" 
                    placeholder="Nhập số"
                    value={decisionNumber}
                    readOnly
                    disabled
                  />
                  <span>/QĐ-NHNo-TCNS</span>
                </div>
              </label>
              <label>
                <span>Ngày quyết định</span>
                <DateInputWithPicker
                  placeholder="Chọn ngày"
                  ariaLabel="Ngày quyết định"
                  value={decisionDate}
                  onChange={() => {}}
                  disabled
                />
              </label>
            </div>
          </div>

          <div className="form-section">
            <h3>Thông tin người lao động</h3>
            <div className="form-grid two-columns employee-info-columns">
              <div className="form-grid single-column">
                <label>
                  <span>Họ và tên</span>
                  <input 
                    type="text" 
                    placeholder="Nhập họ và tên"
                    value={fullName}
                    readOnly
                    disabled
                  />
                </label>
                <label>
                  <span>Email nhận tài khoản</span>
                  <input 
                    type="email" 
                    placeholder="Nhập email" 
                    value={accountEmail} 
                    readOnly
                    disabled
                  />
                </label>
                <label>
                  <span>Nơi cấp</span>
                  <input 
                    type="text" 
                    placeholder="Nhập nơi cấp"
                    value={issuingLocation}
                    readOnly
                    disabled
                  />
                </label>
              </div>

              <div className="form-grid single-column">
                <div className="form-grid two-columns">
                  <label>
                    <span>Quốc tịch</span>
                    <input 
                      type="text" 
                      placeholder="Chọn quốc tịch"
                      value={nationality}
                      readOnly
                      disabled
                    />
                  </label>
                  <label>
                    <span>Ngày sinh</span>
                    <DateInputWithPicker
                      placeholder="Chọn ngày sinh"
                      ariaLabel="Ngày sinh"
                      value={dateOfBirth}
                      onChange={() => {}}
                      disabled
                    />
                  </label>
                </div>
                <div className="form-grid two-columns">
                  <label>
                    <span>Số CCCD/Hộ chiếu</span>
                    <input 
                      type="text" 
                      placeholder="Nhập số CCCD"
                      value={citizenIdNumber}
                      readOnly
                      disabled
                    />
                  </label>
                  <label>
                    <span>Ngày cấp</span>
                    <DateInputWithPicker
                      placeholder="Chọn ngày cấp"
                      ariaLabel="Ngày cấp"
                      value={dateIssued}
                      onChange={() => {}}
                      disabled
                    />
                  </label>
                </div>
                <label>
                  <span>Địa chỉ thường trú</span>
                  <input 
                    type="text" 
                    placeholder="Nhập địa chỉ thường trú"
                    value={address}
                    readOnly
                    disabled
                  />
                </label>
              </div>

              <label className="full-width">
                <span>Trình độ đào tạo</span>
                <input 
                  type="text" 
                  placeholder="Nhập trình độ đào tạo"
                  value={levelOfTraining}
                  readOnly
                  disabled
                />
              </label>
            </div>
          </div>
          
          <div className="form-section">
            <h3>Tài liệu đính kèm</h3>
            {uploadedFiles.length > 0 ? (
              <div className="uploaded-files-grid">
                <div className="files-card-container">
                  {uploadedFiles.map((file, index) => (
                    <div 
                      key={index} 
                      className="file-card" 
                      onClick={() => setViewingPdfUrl(`http://localhost:8080/api/contracts/${contractCode}/staff-documents/${file.id}/view`)}
                      style={{ cursor: 'pointer' }}
                      title="Nhấn để xem tài liệu"
                    >
                      <div className="file-icon">
                        <svg viewBox="0 0 24 24" fill="none">
                          <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M13 2v7h7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div className="file-info">
                        <p className="file-name">{file.fileName}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p style={{ color: '#7a8498', fontSize: '14px', marginTop: '10px' }}>Không có tài liệu đính kèm.</p>
            )}
          </div>
        </div>

        <div className="panel create-side-panel">
          <header className="panel-header panel-header-actions">
            <h2>Nội dung hợp đồng</h2>
          </header>

          <div className="form-section compact">
            <h3>Thời hạn của hợp đồng thử việc</h3>
            <div className="form-grid single-column">
              <label>
                <span>Ngày bắt đầu</span>
                <DateInputWithPicker
                  placeholder="Chọn ngày"
                  ariaLabel="Ngày bắt đầu"
                  value={startDate}
                  onChange={() => {}}
                  disabled
                />
              </label>
              <div className="form-grid two-columns">
                <label>
                  <span>Số ngày thử việc</span>
                  <input
                    type="text"
                    value={probationDays}
                    readOnly
                    disabled
                  />
                </label>
                <label>
                  <span>Ngày kết thúc</span>
                  <input
                    type="text"
                    value={endDate}
                    className="computed-field"
                    readOnly
                    disabled
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="form-section compact">
            <h3>Quyền lợi người lao động</h3>
            <div className="form-grid single-column">
              <div className="form-grid two-columns">
                <label>
                  <span>Nơi làm việc</span>
                  <input
                     type="text"
                     value={workLocationName}
                     readOnly
                     disabled
                  />
                </label>
                <label>
                  <span>Vị trí công việc</span>
                  <input
                     type="text"
                     value={jobPosition}
                     readOnly
                     disabled
                  />
                </label>
              </div>
              <div className="form-grid two-columns">
                <label>
                  <span>Ngạch lương</span>
                  <select 
                    value={salaryGrade} 
                    disabled
                  >
                    <option value={salaryGrade}>{salaryGrade}</option>
                  </select>
                </label>
                <label>
                  <span>Mức</span>
                  <select 
                    value={salaryStep} 
                    disabled
                  >
                    <option value={salaryStep}>{salaryStep}</option>
                  </select>
                </label>
              </div>
              <div className="form-grid two-columns">
                <label>
                  <span>% lương thử việc</span>
                  <input 
                    type="text" 
                    value={percentageOfSalary}
                    readOnly
                    disabled
                  />
                </label>
                <label>
                  <span>Mức lương thử việc (VND)</span>
                  <input 
                    type="text" 
                    className="computed-field" 
                    value={probationarySalary}
                    readOnly
                    disabled
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {viewingPdfUrl && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ background: 'white', width: '80%', height: '90%', borderRadius: '8px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.2)' }}>
            <div style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eaebef', background: '#f8f9fc' }}>
              <h3 style={{ margin: 0, fontSize: '18px', color: '#1f2a44' }}>Xem tài liệu đính kèm</h3>
              <button 
                onClick={() => setViewingPdfUrl(null)} 
                style={{ border: 'none', background: 'none', fontSize: '28px', cursor: 'pointer', color: '#7a8498', padding: '0 8px', lineHeight: 1 }}
                title="Đóng"
                aria-label="Đóng"
              >
                &times;
              </button>
            </div>
            <div style={{ flex: 1, padding: '0', background: '#e0e0e0' }}>
              <iframe 
                src={viewingPdfUrl} 
                style={{ width: '100%', height: '100%', border: 'none' }} 
                title="PDF Document Viewer"
              />
            </div>
          </div>
        </div>
      )}

      {showConfirmStampModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 2000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ background: 'white', padding: '24px', borderRadius: '8px', width: '400px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
            <h3 style={{ margin: '0 0 16px', color: '#1f2a44' }}>Xác nhận phê duyệt</h3>
            <p style={{ margin: '0 0 24px', color: '#4f5f77', lineHeight: '1.5' }}>Bạn có chắc chắn muốn phê duyệt hợp đồng <strong>{contractCode}</strong>? Hành động này sẽ đóng dấu và phát hành hợp đồng chính thức.</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button 
                onClick={() => setShowConfirmStampModal(false)}
                style={{ padding: '8px 16px', border: '1px solid #eaebef', background: '#fff', borderRadius: '6px', cursor: 'pointer', color: '#4f5f77', fontWeight: 500 }}
                disabled={isStamping}
              >
                Hủy
              </button>
              <button 
                onClick={handleConfirmStamp}
                style={{ padding: '8px 16px', border: 'none', background: '#2e7d32', borderRadius: '6px', cursor: 'pointer', color: '#fff', fontWeight: 500 }}
                disabled={isStamping}
              >
                {isStamping ? 'Đang xử lý...' : 'Xác nhận phê duyệt'}
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

export default ViewContractDetail;

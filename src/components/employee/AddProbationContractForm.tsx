import React, { useMemo, useRef, useState, useEffect } from 'react';
import { contractService } from '../../services/contractService';
import { branchService, Branch } from '../../services/branchService';
import SearchableSelect from '../common/SearchableSelect';
import { CreateContractRequestDTO } from '../../types/contract';

const JOB_POSITIONS = [
  'Chuyên viên kỹ thuật',
  'Chuyên viên Kỹ thuật Sáng tạo số',
  'Nhân viên giám sát, phòng ngừa rủi ro',
  'Chuyên viên An toàn thông tin',
  'Chuyên viên Phần mềm ứng dụng',
  'Chuyên viên bảo mật',
  'Chuyên viên Quản trị số',
  'Chuyên viên Phát triển phần mềm',
  'Chuyên viên Quản trị cơ sở dữ liệu',
  'Chuyên viên Quản trị cơ sở dữ liệu dự phòng',
  'Chuyên viên Quản trị hệ thống máy chủ',
];

interface AddProbationContractFormProps {
  onBack: () => void;
}

function toIsoDate(value: string): string {
  if (!value) {
    return '';
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  const parts = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!parts) {
    return '';
  }

  const [, day, month, year] = parts;
  return `${year}-${month}-${day}`;
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

  const [, year, month, day] = parts;
  return `${day}/${month}/${year}`;
}

function formatDisplayDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function calculateEndDate(startDate: string, probationDays: string): string {
  const isoStartDate = toIsoDate(startDate);
  const dayCount = Number(probationDays);

  if (!isoStartDate || !Number.isFinite(dayCount) || dayCount <= 0) {
    return '';
  }

  const [year, month, day] = isoStartDate.split('-').map(Number);
  const calculatedDate = new Date(year, month - 1, day);
  calculatedDate.setDate(calculatedDate.getDate() + dayCount);

  return formatDisplayDate(calculatedDate);
}

interface DateInputWithPickerProps {
  placeholder: string;
  ariaLabel: string;
  value: string;
  onChange: (nextValue: string) => void;
}

function DateInputWithPicker({ placeholder, ariaLabel, value, onChange }: DateInputWithPickerProps) {
  const hiddenDateInputRef = useRef<HTMLInputElement>(null);

  const openPicker = () => {
    const dateElement = hiddenDateInputRef.current;
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

  return (
    <div className="date-input-wrapper">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label={ariaLabel}
      />
      <button type="button" className="date-picker-button" onClick={openPicker} aria-label={`Mở lịch ${ariaLabel}`}>
        <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <rect x="3" y="4.5" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
          <path d="M6 3v3M14 3v3M3 8h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
      <input
        ref={hiddenDateInputRef}
        className="hidden-date-input"
        type="date"
        value={toIsoDate(value)}
        onChange={(event) => onChange(toDisplayDate(event.target.value))}
        tabIndex={-1}
        aria-hidden="true"
      />
    </div>
  );
}

function AddProbationContractForm({ onBack }: AddProbationContractFormProps) {
  // Contract info
  const [decisionNumber, setDecisionNumber] = useState('');
  const [decisionDate, setDecisionDate] = useState('');
  
  // Employee info
  const [fullName, setFullName] = useState('');
  const [accountEmail, setAccountEmail] = useState('');
  const [nationality, setNationality] = useState('');
  const [dateOfBirth, setBirthDate] = useState('');
  const [citizenIdNumber, setCitizenIdNumber] = useState('');
  const [dateIssued, setIssueDate] = useState('');
  const [issuingLocation, setIssuingLocation] = useState('');
  const [address, setAddress] = useState('');
  const [levelOfTraining, setLevelOfTraining] = useState('');
  
  // Contract terms
  const [startDate, setStartDate] = useState('');
  const [probationDays, setProbationDays] = useState('');
  const [workLocation, setWorkLocation] = useState<number | string>('');
  const [jobPosition, setJobPosition] = useState<string | number>('');
  
  // Branches data
  const [branches, setBranches] = useState<Branch[]>([]);
  const [branchesLoading, setBranchesLoading] = useState(true);
  
  // Salary info
  const [salaryGrade, setSalaryGrade] = useState('Ngạch 7');
  const [salaryStep, setSalaryStep] = useState('Mức 1');
  const [percentageOfSalary, setPercentageOfSalary] = useState('85');
  const [probationarySalary, setProbationarySalary] = useState('21.500.000');
  
  // UI states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  // Fetch branches on component mount
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setBranchesLoading(true);
        const data = await branchService.getAllBranches();
        setBranches(data);
      } catch (err) {
        console.error('Error fetching branches:', err);
        setError('Lỗi tải danh sách nơi làm việc');
      } finally {
        setBranchesLoading(false);
      }
    };

    fetchBranches();
  }, []);

  const endDate = useMemo(() => calculateEndDate(startDate, probationDays), [startDate, probationDays]);

  const salaryStepOptions = useMemo(
    () => Array.from({ length: 7 }, (_, index) => `Mức ${index + 1}`),
    []
  );

  // File upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      // Filter to only allow PDF files
      const validFiles = newFiles.filter(file => {
        return file.type === 'application/pdf';
      });
      
      if (validFiles.length < newFiles.length) {
        setError('Chỉ hỗ trợ file PDF');
        return;
      }
      
      setUploadedFiles([...uploadedFiles, ...validFiles]);
      // Reset input
      e.target.value = '';
    }
  };

  // Remove file handler
  const handleRemoveFile = (indexToRemove: number) => {
    setUploadedFiles(uploadedFiles.filter((_, index) => index !== indexToRemove));
  };

  // Validation function
  const validateForm = (): boolean => {
    setError('');
    
    const requiredFields = {
      'Căn cứ quyết định số': decisionNumber,
      'Ngày quyết định': decisionDate,
      'Họ và tên': fullName,
      'Email': accountEmail,
      'Quốc tịch': nationality,
      'Ngày sinh': dateOfBirth,
      'Số CCCD/Hộ chiếu': citizenIdNumber,
      'Ngày cấp': dateIssued,
      'Nơi cấp': issuingLocation,
      'Địa chỉ': address,
      'Trình độ đào tạo': levelOfTraining,
      'Ngày bắt đầu': startDate,
      'Số ngày thử việc': probationDays,
      'Nơi làm việc': workLocation,
      'Vị trí công việc': jobPosition,
    };

    const emptyField = Object.entries(requiredFields).find(([_, value]) => !value || value.toString().trim() === '');
    if (emptyField) {
      setError(`Vui lòng điền đầy đủ thông tin: ${emptyField[0]}`);
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(accountEmail)) {
      setError('Email không hợp lệ');
      return false;
    }

    return true;
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess(false);

    try {
      const request: CreateContractRequestDTO = {
        decisionNumber,
        decisionDate,
        email: accountEmail,
        fullName,
        nationality,
        dateOfBirth,
        citizenIdNumber,
        soCCCD: citizenIdNumber,
        dateIssued,
        issuingLocation,
        address,
        levelOfTraining,
        startDate,
        endDate,
        salaryRank: salaryGrade,
        level: salaryStep,
        percentageOfSalary: parseFloat(percentageOfSalary) || 0,
        probationarySalary: parseFloat(probationarySalary.replace(/\./g, '')) || 0,
        jobPosition: String(jobPosition),
        branchId: Number(workLocation) || 1,
      };

      const response = await contractService.initContract(request, uploadedFiles);
      
      setSuccess(true);
      setError('');
      
      // Reset form
      setTimeout(() => {
        setDecisionNumber('');
        setDecisionDate('');
        setFullName('');
        setAccountEmail('');
        setNationality('');
        setBirthDate('');
        setCitizenIdNumber('');
        setIssueDate('');
        setIssuingLocation('');
        setAddress('');
        setLevelOfTraining('');
        setStartDate('');
        setProbationDays('');
        setWorkLocation('');
        setJobPosition('');
        setUploadedFiles([]);
        setSuccess(false);
        
        // Optionally navigate back
        onBack();
      }, 2000);
      
      console.log('Contract created:', response);
      alert(`Tạo hợp đồng thành công! Mã hợp đồng: ${response.contractCode}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Lỗi tạo hợp đồng';
      setError(errorMessage);
      console.error('Error creating contract:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="create-contract-page" aria-label="Thêm mới hợp đồng thử việc">
      <header className="create-contract-topbar">
        <button type="button" className="back-button" onClick={onBack}>
          <span className="back-button-icon" aria-hidden="true">
            <svg viewBox="0 0 16 16" fill="none">
              <path d="M9.8 3.5L5.2 8l4.6 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span>Thêm mới hợp đồng thử việc</span>
        </button>
        <div className="create-actions">
          <button 
            type="button" 
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? 'Đang xử lý...' : '+ Thêm mới'}
          </button>
          <button type="button" className="btn btn-ghost btn-with-icon">
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
            <span>Xem trước</span>
          </button>
          <button type="button" className="btn btn-ghost btn-with-icon">
            <span className="btn-icon-inline" aria-hidden="true">
              <svg viewBox="0 0 16 16" fill="none">
                <path
                  d="M4.2 2.8h7.6a1 1 0 011 1v9.4l-3.2-2-3.2 2V3.8a1 1 0 011-1z"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span>Lưu nháp</span>
          </button>
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
            {success && (
              <div className="success-message" style={{ marginBottom: '20px', padding: '12px', backgroundColor: '#f0f9ff', border: '1px solid #a6e3a1', borderRadius: '6px', color: '#22863a', fontSize: '14px' }}>
                ✓ Hợp đồng đã được tạo thành công!
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
                    onChange={(e) => setDecisionNumber(e.target.value)}
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
                  onChange={setDecisionDate}
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
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </label>
                <label>
                  <span>Email nhận tài khoản</span>
                  <input 
                    type="email" 
                    placeholder="Nhập email" 
                    value={accountEmail} 
                    onChange={(e) => setAccountEmail(e.target.value)} 
                  />
                </label>
                <label>
                  <span>Nơi cấp</span>
                  <input 
                    type="text" 
                    placeholder="Nhập nơi cấp"
                    value={issuingLocation}
                    onChange={(e) => setIssuingLocation(e.target.value)}
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
                      onChange={(e) => setNationality(e.target.value)}
                    />
                  </label>
                  <label>
                    <span>Ngày sinh</span>
                    <DateInputWithPicker
                      placeholder="Chọn ngày sinh"
                      ariaLabel="Ngày sinh"
                      value={dateOfBirth}
                      onChange={setBirthDate}
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
                      onChange={(e) => setCitizenIdNumber(e.target.value)}
                    />
                  </label>
                  <label>
                    <span>Ngày cấp</span>
                    <DateInputWithPicker
                      placeholder="Chọn ngày cấp"
                      ariaLabel="Ngày cấp"
                      value={dateIssued}
                      onChange={setIssueDate}
                    />
                  </label>
                </div>
                <label>
                  <span>Địa chỉ thường trú</span>
                  <input 
                    type="text" 
                    placeholder="Nhập địa chỉ thường trú"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </label>
              </div>

              <label className="full-width">
                <span>Trình độ đào tạo</span>
                <input 
                  type="text" 
                  placeholder="Nhập trình độ đào tạo"
                  value={levelOfTraining}
                  onChange={(e) => setLevelOfTraining(e.target.value)}
                />
              </label>
            </div>
          </div>

          <div className="form-section">
            <h3>Tài liệu đính kèm</h3>
            <div className="upload-box">
              <strong>Tải lên tài liệu</strong>
              <span>Định dạng PDF</span>
              <input 
                type="file" 
                multiple
                accept=".pdf"
                onChange={handleFileUpload}
                aria-label="Tải lên tài liệu PDF"
              />
            </div>
            {uploadedFiles.length > 0 && (
              <div className="uploaded-files-grid">
                <strong>Tài liệu đã tải lên:</strong>
                <div className="files-card-container">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="file-card">
                      <div className="file-icon">
                        <svg viewBox="0 0 24 24" fill="none">
                          <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M13 2v7h7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div className="file-info">
                        <p className="file-name">{file.name}</p>
                        <p className="file-size">{(file.size / 1024).toFixed(2)} KB</p>
                      </div>
                      <button 
                        type="button" 
                        className="remove-file-btn"
                        onClick={() => handleRemoveFile(index)}
                        aria-label={`Xóa file ${file.name}`}
                        title="Xóa file"
                      >
                        <svg viewBox="0 0 24 24" fill="none">
                          <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="panel create-side-panel">
          <header className="panel-header panel-header-actions">
            <h2>Nội dung hợp đồng</h2>
            <button type="button" className="btn btn-icon" aria-label="Thêm tùy chọn">
              ...
            </button>
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
                  onChange={setStartDate}
                />
              </label>
              <div className="form-grid two-columns">
                <label>
                  <span>Số ngày thử việc</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="Nhập số ngày"
                    value={probationDays}
                    onChange={(event) => setProbationDays(event.target.value.replace(/\D/g, ''))}
                  />
                </label>
                <label>
                  <span>Ngày kết thúc</span>
                  <input
                    type="text"
                    placeholder="Tự động tính"
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
                  <SearchableSelect
                    options={branches.map((branch) => ({
                      id: branch.id,
                      label: branch.branchName,
                    }))}
                    value={workLocation}
                    onChange={setWorkLocation}
                    placeholder="Chọn nơi làm việc"
                    disabled={branchesLoading}
                  />
                </label>
                <label>
                  <span>Vị trí công việc</span>
                  <SearchableSelect
                    options={JOB_POSITIONS.map((position, index) => ({
                      id: position,
                      label: position,
                    }))}
                    value={jobPosition}
                    onChange={setJobPosition}
                    placeholder="Chọn vị trí công việc"
                  />
                </label>
              </div>
              <div className="form-grid two-columns">
                <label>
                  <span>Ngạch lương</span>
                  <select 
                    value={salaryGrade} 
                    onChange={(event) => setSalaryGrade(event.target.value)} 
                    disabled
                    required
                  >
                    <option value="Ngạch 5">Ngạch 5</option>
                    <option value="Ngạch 7">Ngạch 7</option>
                  </select>
                </label>
                <label>
                  <span>Mức</span>
                  <select 
                    value={salaryStep} 
                    onChange={(event) => setSalaryStep(event.target.value)} 
                    disabled
                    required
                  >
                    {salaryStepOptions.map((optionValue) => (
                      <option key={optionValue} value={optionValue}>
                        {optionValue}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="form-grid two-columns">
                <label>
                  <span>% lương thử việc</span>
                  <input 
                    type="text" 
                    placeholder="Nhập %" 
                    value={percentageOfSalary}
                    onChange={(e) => setPercentageOfSalary(e.target.value)}
                    disabled
                  />
                </label>
                <label>
                  <span>Mức lương thử việc (VND)</span>
                  <input 
                    type="text" 
                    placeholder="Tự động tính" 
                    className="computed-field" 
                    value={probationarySalary}
                    onChange={(e) => setProbationarySalary(e.target.value)}
                    disabled
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AddProbationContractForm;


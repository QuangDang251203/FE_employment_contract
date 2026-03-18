import React, { useMemo, useRef, useState } from 'react';

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
  const [decisionDate, setDecisionDate] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [startDate, setStartDate] = useState('');
  const [probationDays, setProbationDays] = useState('');
  const [salaryGrade, setSalaryGrade] = useState('');
  const [salaryStep, setSalaryStep] = useState('');

  const endDate = useMemo(() => calculateEndDate(startDate, probationDays), [startDate, probationDays]);

  const salaryStepOptions = useMemo(
    () => Array.from({ length: 7 }, (_, index) => `Mức ${index + 1}`),
    []
  );

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
          <button type="button" className="btn btn-primary">
            + Thêm mới
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
            <div className="form-grid two-columns">
              <label>
                <span>Căn cứ quyết định số</span>
                <div className="inline-field">
                  <input type="text" placeholder="Nhập số" />
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
                  <input type="text" placeholder="Nhập họ và tên" />
                </label>
                <label>
                  <span>Quốc tịch</span>
                  <input type="text" placeholder="Chọn quốc tịch" />
                </label>
                <label>
                  <span>Nơi cấp</span>
                  <input type="text" placeholder="Nhập nơi cấp" />
                </label>
              </div>

              <div className="form-grid single-column">
                <label>
                  <span>Ngày sinh</span>
                  <DateInputWithPicker
                    placeholder="Chọn ngày sinh"
                    ariaLabel="Ngày sinh"
                    value={birthDate}
                    onChange={setBirthDate}
                  />
                </label>
                <div className="form-grid two-columns">
                  <label>
                    <span>Số CCCD/Hộ chiếu</span>
                    <input type="text" placeholder="Nhập số CCCD" />
                  </label>
                  <label>
                    <span>Ngày cấp</span>
                    <DateInputWithPicker
                      placeholder="Chọn ngày cấp"
                      ariaLabel="Ngày cấp"
                      value={issueDate}
                      onChange={setIssueDate}
                    />
                  </label>
                </div>
                <label>
                  <span>Địa chỉ thường trú</span>
                  <input type="text" placeholder="Nhập địa chỉ thường trú" />
                </label>
              </div>

              <label className="full-width">
                <span>Trình độ đào tạo</span>
                <input type="text" placeholder="Nhập trình độ đào tạo" />
              </label>
            </div>
          </div>

          <div className="form-section">
            <h3>Tài liệu đính kèm</h3>
            <div className="upload-box">
              <strong>Tải lên tài liệu</strong>
              <span>Định dạng Word, PDF</span>
            </div>
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
              <label>
                <span>Tên vị trí công việc</span>
                <input type="text" placeholder="Nhập tên vị trí công việc" />
              </label>
              <div className="form-grid two-columns">
                <label>
                  <span>Ngạch lương</span>
                  <select value={salaryGrade} onChange={(event) => setSalaryGrade(event.target.value)} required>
                    <option value="" disabled>
                      Chọn ngạch
                    </option>
                    <option value="Ngạch 5">Ngạch 5</option>
                    <option value="Ngạch 7">Ngạch 7</option>
                  </select>
                </label>
                <label>
                  <span>Mức</span>
                  <select value={salaryStep} onChange={(event) => setSalaryStep(event.target.value)} required>
                    <option value="" disabled>
                      Chọn mức
                    </option>
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
                  <input type="text" placeholder="Nhập %" />
                </label>
                <label>
                  <span>Mức lương thử việc (VND)</span>
                  <input type="text" placeholder="Tự động tính" className="computed-field" readOnly disabled />
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


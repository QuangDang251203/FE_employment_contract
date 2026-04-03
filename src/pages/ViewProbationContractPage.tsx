import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../style/view-probation-contract.css';
import logo from '../assets/images/agribank_logo.png';
import iconSign from '../assets/icon_signContract/iconSign.png';
import iconDownload from '../assets/icon_signContract/iconDownload.png';
import iconFilePDF from '../assets/icon_signContract/iconFilePDF.png';
import iconTranslate from '../assets/icon_signContract/iconTranslate.png';

interface Document {
  fileName: string;
  filePath: string;
  id?: number; // staffFileId for staff documents
  isContract?: boolean; // true for main contract, false for staff documents
}

interface ContractDetail {
  contractCode: string;
  staffFullName: string;
  startDate: string;
  endDate: string;
  status: string; // PENDING_SIGN, COMPLETED, STAMPED, etc.
  staffDocuments: Document[];
}

interface ProcessFileDTO {
  id: number;
  fileType: 'GENERATED_PDF' | 'SIGNED_PDF' | 'STAMPED_PDF';
  signAt: string;
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

const ViewProbationContractPage: React.FC = () => {
  const { contractCode } = useParams<{ contractCode: string }>();
  const navigate = useNavigate();
  const [contract, setContract] = useState<ContractDetail | null>(null);
  const [processFiles, setProcessFiles] = useState<ProcessFileDTO[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Signature modal states
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signatureBlob, setSignatureBlob] = useState<Blob | null>(null);
  const signatureCanvasRef = React.useRef<HTMLCanvasElement>(null);
  
  // OTP modal states
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);

  useEffect(() => {
    const fetchContract = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api'}/contracts/${contractCode}`
        );

        if (!response.ok) {
          throw new Error('Lỗi tải hợp đồng');
        }

        const data = await response.json();
        if (data.code === 'SUCCESS') {
          // Detect status from contractFiles array
          // If signed PDF exists, contract is COMPLETED
          const contractData = data.data;
          const hasSignedPdf = contractData.contractFiles?.some(
            (file: any) => file.fileType === 'SIGNED_PDF' || file.fileType === 'application/pdf' && file.fileName?.includes('signed')
          );
          
          if (hasSignedPdf && !contractData.status) {
            contractData.status = 'COMPLETED';
          }
          
          console.log('Contract data fetched:', contractData);
          console.log('Contract status:', contractData.status);
          setContract(contractData);
          
          // Create documents array with contract as first item
          const documentsWithContract = [
            {
              fileName: 'Hợp đồng',
              filePath: '',
              isContract: true,
            },
            ...(data.data.staffDocuments || []),
          ];
          
          // Set first document (contract) as selected
          setSelectedDocument(documentsWithContract[0]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Lỗi tải hợp đồng');
      } finally {
        setIsLoading(false);
      }
    };

    const fetchProcessFiles = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api'}/contracts/${contractCode}/process-files`);
        if (response.ok) {
          const data = await response.json();
          setProcessFiles(data.data || []);
        }
      } catch (err) {
        console.error('Error fetching process files:', err);
      }
    };

    if (contractCode) {
      fetchContract();
      fetchProcessFiles();
    }
  }, [contractCode]);

  const handleSign = () => {
    setShowSignatureModal(true);
  };

  const initSignatureCanvas = () => {
    if (signatureCanvasRef.current) {
      const canvas = signatureCanvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  useEffect(() => {
    if (showSignatureModal) {
      initSignatureCanvas();
    }
  }, [showSignatureModal]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = signatureCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (ctx) {
        ctx.beginPath();
        ctx.moveTo(x, y);
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = signatureCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (ctx) {
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = '#000';
        ctx.lineTo(x, y);
        ctx.stroke();
      }
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = signatureCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      if (ctx) {
        ctx.beginPath();
        ctx.moveTo(x, y);
      }
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = signatureCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      if (ctx) {
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = '#000';
        ctx.lineTo(x, y);
        ctx.stroke();
      }
    }
  };

  const handleTouchEnd = () => {
    setIsDrawing(false);
  };

  const handleConfirmSignature = () => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) {
      alert('Lỗi: Không thể tìm thấy canvas');
      return;
    }

    // Capture signature blob before closing modal
    canvas.toBlob((blob) => {
      if (!blob) {
        alert('Lỗi: Không thể tạo file chữ ký');
        return;
      }
      
      console.log('Signature captured:', blob.size, 'bytes');
      setSignatureBlob(blob);
      
      // Close signature modal and open OTP modal
      setShowSignatureModal(false);
      setShowOTPModal(true);
      setOtp(['', '', '', '', '', '']);
      setOtpError('');
    }, 'image/png');
  };

  const handleRedrawSignature = () => {
    initSignatureCanvas();
  };

  const handleCancelSignature = () => {
    setShowSignatureModal(false);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`view-otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`view-otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const pastedDigits = pastedData.replace(/\D/g, '').substring(0, 6);

    if (pastedDigits.length === 6 && /^\d{6}$/.test(pastedDigits)) {
      setOtp(pastedDigits.split(''));
      // Focus last input after paste
      setTimeout(() => {
        const lastInput = document.getElementById('view-otp-5');
        if (lastInput) lastInput.focus();
      }, 0);
    }
  };

  const handleOtpSubmit = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setOtpError('Vui lòng nhập đầy đủ 6 chữ số OTP');
      return;
    }

    // Check if signature was captured
    if (!signatureBlob) {
      setOtpError('Lỗi: Chữ ký không được tìm thấy. Vui lòng ký lại.');
      console.error('Signature blob is null');
      return;
    }

    setOtpLoading(true);
    setOtpError('');

    try {
      const username = localStorage.getItem('signContractUsername');
      console.log('Submitting OTP with signature:', {
        username,
        contractCode,
        otpCode: otpCode.length,
        signatureBlobSize: signatureBlob.size,
      });

      const formData = new FormData();
      
      // Create OTP DTO JSON
      const otpDtoJson = JSON.stringify({
        username: username,
        contractCode: contractCode,
        otpCode: otpCode,
      });
      
      // Append OTP data as JSON blob
      formData.append('otp', new Blob([otpDtoJson], { type: 'application/json' }), 'otp.json');
      
      // Append signature image
      formData.append('signature', signatureBlob, 'signature.png');

      console.log('FormData entries:', {
        otpSize: new Blob([otpDtoJson]).size,
        signatureSize: signatureBlob.size,
      });

      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api'}/contracts/verify-otp-sign`,
        {
          method: 'POST',
          body: formData,
        }
      );

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: `HTTP ${response.status}`,
        }));
        console.error('Error response:', errorData);
        throw new Error(errorData.message || 'Xác nhận OTP thất bại');
      }

      const result = await response.json();
      console.log('Success response:', result);

      if (result.code !== 'SUCCESS') {
        throw new Error(result.message || 'Xác nhận OTP thất bại');
      }

      setShowOTPModal(false);
      setSignatureBlob(null);
      alert('Ký hợp đồng thành công!');

      // Reload current page to show updated contract
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Lỗi xác nhận OTP';
      console.error('OTP submit error:', errorMessage, err);
      setOtpError(errorMessage);
      setOtpLoading(false);
    }
  };

  const handleReject = () => {
    console.log('Rejecting contract:', contractCode);
  };

  const handleDownload = () => {
    if (selectedDocument) {
      const link = document.createElement('a');
      link.href = selectedDocument.filePath;
      link.download = selectedDocument.fileName;
      link.click();
    }
  };

  if (isLoading) {
    return (
      <div className="view-contract-loading">
        <div className="view-contract-spinner"></div>
        <p>Đang tải hợp đồng...</p>
      </div>
    );
  }

  if (error || !contract) {
    return (
      <div className="view-contract-error">
        <p>{error || 'Không thể tải hợp đồng'}</p>
        <button onClick={() => navigate(`/signAProbationContract/${contractCode}`)}>
          Quay lại
        </button>
      </div>
    );
  }

  return (
    <div className="view-contract-container">
      <aside className="view-contract-sidebar">
        <h3 className="view-contract-sidebar-title">Danh sách tài liệu</h3>
        <div className="view-contract-documents">
          {contract ? (
            <>
              {/* Main Contract Item */}
              <button
                className={`view-contract-doc-item ${selectedDocument?.isContract ? 'active' : ''}`}
                onClick={() => setSelectedDocument({
                  fileName: 'Hợp đồng',
                  filePath: '',
                  isContract: true,
                })}
              >
                <img src={iconFilePDF} alt="file" className="view-contract-doc-icon" />
                <span>Hợp đồng</span>
              </button>

              {/* Staff Documents */}
              {contract.staffDocuments && contract.staffDocuments.length > 0 ? (
                contract.staffDocuments.map((doc, index) => (
                  <button
                    key={index}
                    className={`view-contract-doc-item ${
                      selectedDocument?.id === doc.id && !selectedDocument?.isContract ? 'active' : ''
                    }`}
                    onClick={() => setSelectedDocument({
                      ...doc,
                      isContract: false,
                    })}
                  >
                    <img src={iconFilePDF} alt="file" className="view-contract-doc-icon" />
                    <span>{doc.fileName}</span>
                  </button>
                ))
              ) : null}
            </>
          ) : (
            <p className="view-contract-no-docs">Không có tài liệu</p>
          )}
        </div>

        {/* Vertical Timeline */}
        <h3 className="view-contract-sidebar-title" style={{ marginTop: '24px' }}>Tiến trình</h3>
        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[
            { key: 'GENERATED_PDF', label: 'Tạo HĐ' },
            { key: 'SIGNED_PDF', label: 'Ký' },
            { key: 'STAMPED_PDF', label: 'Duyệt' }
          ].map((step, index, arr) => {
            const file = processFiles.find(f => f.fileType === step.key);
            const isCompleted = !!file;
            const nextFile = index < arr.length - 1 ? processFiles.find(f => f.fileType === arr[index + 1].key) : null;
            
            return (
              <div key={step.key} style={{ display: 'flex', position: 'relative' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: '12px' }}>
                  <div style={{ 
                    width: '24px', height: '24px', borderRadius: '50%', 
                    background: isCompleted ? '#2e7d32' : '#fff',
                    border: isCompleted ? '2px solid #2e7d32' : '2px solid #ffcdd2',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: isCompleted ? '#fff' : '#d32f2f', fontSize: '12px', fontWeight: 'bold',
                    zIndex: 2
                  }}>
                    {isCompleted ? '✓' : (index + 1)}
                  </div>
                  {index < arr.length - 1 && (
                    <div style={{ width: '2px', height: '40px', background: nextFile ? '#2e7d32' : '#ffebee', flex: 1 }} />
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', paddingTop: '2px', paddingBottom: '16px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: isCompleted ? '#2e7d32' : '#7a8498' }}>{step.label}</span>
                  {isCompleted && (
                    <span style={{ fontSize: '12px', color: '#7a8498', marginTop: '2px' }}>
                      {formatDateTimeVN(file.signAt)}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </aside>

      <header className="view-contract-header">
        <div className="view-contract-header-left">
          <img src={logo} alt="Agribank" className="view-contract-header-logo" />
          <button className="view-contract-back-btn" onClick={() => navigate(-1)}>
            <svg viewBox="0 0 20 20" fill="none">
              <path d="M12 5L7 10l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Quay lại
          </button>
        </div>

        <div className="view-contract-header-actions">
          {contract && (contract.status !== 'COMPLETED' && contract.status !== 'STAMPED') ? (
            <>
              <button className="view-contract-btn btn-sign" onClick={handleSign}>
                <img src={iconSign} alt="ký" className="view-contract-btn-icon" />
                Ký
              </button>
              <button className="view-contract-btn btn-reject" disabled>
                <svg viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" />
                  <path d="M6 10h8" stroke="currentColor" strokeWidth="2" />
                </svg>
                Từ chối
              </button>
            </>
          ) : null}
          <button className="view-contract-btn btn-download" onClick={handleDownload}>
            <img src={iconDownload} alt="tải xuống" className="view-contract-btn-icon" />
            Tải xuống
          </button>

          <div className="view-contract-divider"></div>

          <button className="view-contract-btn btn-language">
            <img src={iconTranslate} alt="ngôn ngữ" className="view-contract-btn-icon" />
            <span>Tiếng Việt</span>
            <svg className="dropdown-arrow" viewBox="0 0 20 20" fill="none">
              <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="2" />
            </svg>
          </button>
        </div>
      </header>

      <div className="view-contract-content">
        {selectedDocument ? (
          <div className="view-contract-document">
            <embed
              src={
                selectedDocument.isContract
                  ? `${process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api'}/contracts/${contractCode}/staff-view`
                  : `${process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api'}/contracts/${contractCode}/staff-documents/${selectedDocument.id}/view`
              }
              type="application/pdf"
              width="100%"
              height="100%"
              title={selectedDocument.fileName}
            />
          </div>
        ) : (
          <div className="view-contract-no-content">Vui lòng chọn tài liệu để xem</div>
        )}
      </div>

      <footer className="view-contract-pagination">
        <div className="pagination-info">
          <span>Trang</span>
          <input type="number" value={currentPage} onChange={(e) => setCurrentPage(Number(e.target.value))} min="1" />
        </div>
        <span className="pagination-total">/2</span>
      </footer>

      {showSignatureModal && (
        <div className="view-contract-signature-overlay">
          <div className="view-contract-signature-modal">
            <div className="view-contract-signature-header">
              <h2>Xác nhận chữ ký người đại diện</h2>
              <button
                className="view-contract-signature-close"
                onClick={handleCancelSignature}
              >
                ✕
              </button>
            </div>

            <div className="view-contract-signature-canvas-container">
              <canvas
                ref={signatureCanvasRef}
                width={637}
                height={222}
                className="view-contract-signature-canvas"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              />
            </div>

            <div className="view-contract-signature-actions">
              <button
                className="view-contract-signature-btn btn-confirm"
                onClick={handleConfirmSignature}
              >
                Xác nhận
              </button>
              <button
                className="view-contract-signature-btn btn-redraw"
                onClick={handleRedrawSignature}
              >
                Vẽ lại
              </button>
              <button
                className="view-contract-signature-btn btn-cancel"
                onClick={handleCancelSignature}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {showOTPModal && (
        <div className="view-contract-otp-overlay">
          <div className="view-contract-otp-modal">
            <div className="view-contract-otp-header">
              <h2>Xác nhận ký hợp đồng</h2>
              <button
                className="view-contract-otp-close"
                onClick={() => setShowOTPModal(false)}
                disabled={otpLoading}
              >
                ✕
              </button>
            </div>

            <div className="view-contract-otp-content">
              <p className="view-contract-otp-desc">
                Chúng tôi đã gửi mã OTP đến email của bạn. Vui lòng nhập mã để xác nhận ký hợp đồng.
              </p>

              <div className="view-contract-otp-inputs">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`view-otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    onPaste={handleOtpPaste}
                    className="view-contract-otp-input"
                    disabled={otpLoading}
                    autoComplete="one-time-code"
                    data-lpignore="true"
                    data-1p-ignore="true"
                    data-dashlane-ignore="true"
                  />
                ))}
              </div>

              {otpError && (
                <div className="view-contract-otp-error">
                  <svg viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" />
                    <path d="M10 6v4M10 14v0.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  {otpError}
                </div>
              )}

              <div className="view-contract-otp-actions">
                <button
                  className="view-contract-otp-btn btn-cancel"
                  onClick={() => setShowOTPModal(false)}
                  disabled={otpLoading}
                >
                  Hủy
                </button>
                <button
                  className="view-contract-otp-btn btn-confirm"
                  onClick={handleOtpSubmit}
                  disabled={otpLoading}
                >
                  {otpLoading ? 'Đang xác nhận...' : 'Xác nhận'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewProbationContractPage;



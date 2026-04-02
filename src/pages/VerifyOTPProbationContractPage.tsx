import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../style/verify-otp-probation-contract.css';
import logo from '../assets/images/agribank_logo.png';

const VerifyOTPProbationContractPage: React.FC = () => {
  const { contractCode } = useParams<{ contractCode: string }>();
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Load stored data from login
  const username = localStorage.getItem('signContractUsername');
  const storedContractCode = localStorage.getItem('signContractCode');
  const otpResponse = localStorage.getItem('otpResponse');

  useEffect(() => {
    // Verify data exists
    if (!username || !storedContractCode || storedContractCode !== contractCode) {
      setError('Phiên làm việc không hợp lệ. Vui lòng đăng nhập lại.');
      setTimeout(() => {
        navigate(`/signAProbationContract/${contractCode}`);
      }, 2000);
    }
  }, [contractCode, username, storedContractCode, navigate]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const pastedDigits = pastedData.replace(/\D/g, '').substring(0, 6);

    if (pastedDigits.length === 6 && /^\d{6}$/.test(pastedDigits)) {
      setOtp(pastedDigits.split(''));
      // Focus last input after paste
      setTimeout(() => {
        const lastInput = document.getElementById('otp-5');
        if (lastInput) lastInput.focus();
      }, 0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setError('Vui lòng nhập đầy đủ 6 chữ số OTP');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api'}/contracts/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          contractCode: contractCode,
          otpCode: otpCode,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Xác nhận OTP thất bại');
      }

      const result = await response.json();

      if (result.code !== 'SUCCESS') {
        throw new Error(result.message || 'Xác nhận OTP thất bại');
      }

      setSuccess(true);
      setError('');

      // Redirect to view contract after 1.5s
      setTimeout(() => {
        navigate(`/viewProbationContract/${contractCode}`);
      }, 1500);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Lỗi xác nhận OTP';
      setError(errorMessage);
      console.error('OTP verification error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="verify-otp-container">
      <div className="verify-otp-box">
        <div className="verify-otp-header">
          <img src={logo} alt="Agribank" className="verify-otp-logo" />
          <h1 className="verify-otp-title">Xác nhận OTP</h1>
          <p className="verify-otp-subtitle">
            Chúng tôi đã gửi mã OTP đến email của bạn. Vui lòng nhập mã để tiếp tục.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="verify-otp-form">
          <div className="otp-inputs">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="otp-input"
                disabled={isLoading}
                autoComplete="one-time-code"
                data-lpignore="true"
                data-1p-ignore="true"
                data-dashlane-ignore="true"
              />
            ))}
          </div>

          {error && (
            <div className="verify-otp-error">
              <svg viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" />
                <path d="M10 6v4M10 14v0.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              {error}
            </div>
          )}

          {success && (
            <div className="verify-otp-success">
              <svg viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" />
                <path d="M6 10l2.5 2.5L14 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Xác nhận OTP thành công!
            </div>
          )}

          <button type="submit" className="verify-otp-submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="verify-otp-loader"></span>
                Đang xác nhận...
              </>
            ) : (
              'Xác nhận'
            )}
          </button>

          <p className="verify-otp-note">
            Chưa nhận được mã? <a href="#resend">Gửi lại</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default VerifyOTPProbationContractPage;







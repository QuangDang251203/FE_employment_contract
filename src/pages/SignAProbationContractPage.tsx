import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { contractService } from '../services/contractService';
import '../style/sign-probation-contract.css';
import logo from '../assets/images/agribank_logo.png';
import backgroundLogin from '../assets/images/background_login.png';

interface LoginFormData {
  username: string;
  password: string;
}

const SignAProbationContractPage: React.FC = () => {
  const { contractCode } = useParams<{ contractCode: string }>();
  const [formData, setFormData] = useState<LoginFormData>({
    username: '',
    password: '',
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Load remembered username if exists
  React.useEffect(() => {
    const remembered = localStorage.getItem('rememberedUsername');
    const rememberFlag = localStorage.getItem('rememberMe') === 'true';
    if (remembered && rememberFlag) {
      setFormData((prev) => ({ ...prev, username: remembered }));
      setRememberMe(true);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validation
    if (!formData.username.trim()) {
      setError('Vui lòng nhập tên tài khoản');
      return;
    }

    if (!formData.password) {
      setError('Vui lòng nhập mật khẩu');
      return;
    }

    if (!contractCode) {
      setError('Mã hợp đồng không hợp lệ');
      return;
    }

    setIsLoading(true);

    try {
      // Call login API
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api'}/contracts/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          contractCode: contractCode,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Đăng nhập thất bại (${response.status})`);
      }

      const result = await response.json();

      if (result.code !== 'SUCCESS') {
        throw new Error(result.message || 'Đăng nhập thất bại');
      }

      // Remember username if checked
      if (rememberMe) {
        localStorage.setItem('rememberedUsername', formData.username);
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('rememberedUsername');
        localStorage.removeItem('rememberMe');
      }

      setSuccess(true);
      setError('');

      // Redirect to view contract after 1.5s (skip OTP verification page)
      setTimeout(() => {
        // Save contract code for later use
        localStorage.setItem('signContractCode', contractCode);
        localStorage.setItem('signContractUsername', formData.username);

        // Navigate to view contract page
        window.location.href = `/viewProbationContract/${contractCode}`;
      }, 1500);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Lỗi đăng nhập';
      setError(errorMessage);
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="sign-probation-container"
      style={{
        backgroundImage: `url(${backgroundLogin})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="sign-form-wrapper">
        <div className="sign-form-box">
          <div className="sign-form-header">
            <img src={logo} alt="Agribank" className="sign-form-logo" />
            <h1 className="sign-form-title">Đăng nhập tài khoản</h1>
          </div>

          <form onSubmit={handleSubmit} className="sign-form-content">
            <div className="sign-form-group">
              <div className="sign-form-section">
                {/* Username Field */}
                <div className="sign-form-field">
                  <label className="sign-form-label">Tài khoản Agribank</label>
                  <div className="sign-form-input-wrapper">
                    <input
                      type="text"
                      name="username"
                      placeholder="Nhập tên tài khoản"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="sign-form-input"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="sign-form-field">
                  <label className="sign-form-label">Mật khẩu</label>
                  <div className="sign-form-input-wrapper">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="Nhập mật khẩu"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="sign-form-input"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      className="sign-form-eye-btn"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading || !formData.password}
                      title={showPassword ? 'Ẩn mật khẩu' : 'Hiển thị mật khẩu'}
                    >
                      {showPassword ? (
                        <svg viewBox="0 0 20 20" fill="none">
                          <path d="M10 3.5C5.5 3.5 1.73 6.61 0.5 10.5C1.73 14.39 5.5 17.5 10 17.5C14.5 17.5 18.27 14.39 19.5 10.5C18.27 6.61 14.5 3.5 10 3.5ZM10 15C7.79 15 6 13.21 6 11C6 8.79 7.79 7 10 7C12.21 7 14 8.79 14 11C14 13.21 12.21 15 10 15ZM10 9C8.9 9 8 9.9 8 11C8 12.1 8.9 13 10 13C11.1 13 12 12.1 12 11C12 9.9 11.1 9 10 9Z" fill="currentColor"/>
                        </svg>
                      ) : (
                        <svg viewBox="0 0 20 20" fill="none">
                          <path d="M10 5C5.5 5 1.73 8.11 0.5 12C0.87 12.89 1.4 13.72 2.04 14.44L0.62 15.86C-0.13 15.02 -0.74 14.07 -1.2 13L1.5 10C1.5 7.58 3.58 5.5 6 5.5H10V5ZM10 15C14.5 15 18.27 11.89 19.5 8C19.13 7.11 18.6 6.28 17.96 5.56L19.38 4.14C20.13 4.98 20.74 5.93 21.2 7L18.5 10C18.5 12.42 16.42 14.5 14 14.5H10V15Z" fill="currentColor"/>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div className="sign-form-checkbox">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isLoading}
                />
                <label htmlFor="rememberMe" className="sign-form-checkbox-label">
                  Ghi nhớ đăng nhập
                </label>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="sign-form-error">
                <svg viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2"/>
                  <path d="M10 6v4M10 14v0.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="sign-form-success">
                <svg viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2"/>
                  <path d="M6 10l2.5 2.5L14 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Đăng nhập thành công!
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="sign-form-submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="sign-form-loader"></span>
                  Đang xử lý...
                </>
              ) : (
                'Login'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignAProbationContractPage;


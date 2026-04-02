import React, { useState, useEffect } from 'react';
import '../style/login.css';
import agribankLogo from '../assets/images/agribank_logo.png';
import backgroundLogin from '../assets/images/background_login.png';

interface LoginPageProps {
  onLoginSuccess?: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Load remembered credentials on mount
  useEffect(() => {
    const savedUsername = localStorage.getItem('rememberedUsername');
    const savedRememberMe = localStorage.getItem('rememberMe') === 'true';
    
    if (savedUsername && savedRememberMe) {
      setUsername(savedUsername);
      setRememberMe(true);
    }
  }, []);

  // Check if login button should be enabled
  const isLoginDisabled = !username.trim() || !password.trim();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate login delay
    setTimeout(() => {
      if (username === 'admin' && password === 'admin') {
        // Save remember me preference
        if (rememberMe) {
          localStorage.setItem('rememberedUsername', username);
          localStorage.setItem('rememberMe', 'true');
        } else {
          localStorage.removeItem('rememberedUsername');
          localStorage.removeItem('rememberMe');
        }
        
        // Save login state
        localStorage.setItem('isLoggedIn', 'true');
        
        console.log('Login successful');
        if (onLoginSuccess) {
          onLoginSuccess();
        }
      } else {
        setError('Tài khoản hoặc mật khẩu không chính xác');
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div 
      className="login-container" 
      style={{ backgroundImage: `url(${backgroundLogin})` }}
    >
      <div className="login-content">
        <div className="login-box">
          <div className="logo-section">
            <img src={agribankLogo} alt="Agribank Logo" className="logo" />
          </div>

          <div className="login-header">
            <h2>Đăng nhập tài khoản</h2>
          </div>

          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label htmlFor="username">Tài khoản Agribank</label>
              <input
                id="username"
                type="text"
                placeholder="Vui lòng nhập tài khoản"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Mật khẩu</label>
              <input
                id="password"
                type="password"
                placeholder="Vui lòng nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="form-input"
              />
            </div>

            <div className="remember-me">
              <input
                id="rememberMe"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isLoading}
              />
              <label htmlFor="rememberMe">Ghi nhớ đăng nhập</label>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button
              type="submit"
              disabled={isLoginDisabled || isLoading}
              className="login-button"
            >
              {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;



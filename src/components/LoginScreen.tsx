import React, { useState } from 'react';
import { ArrowLeft, Mail, Lock } from 'lucide-react';
import { Screen, UserProfile } from '../App';

interface LoginScreenProps {
  navigateTo: (screen: Screen) => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
}

export function LoginScreen({ navigateTo, updateUserProfile }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login
    updateUserProfile({ email, name: email.split('@')[0] });
    navigateTo('dashboard');
  };

  const handleGoogleLogin = () => {
    // Mock Google login
    updateUserProfile({ email: 'user@gmail.com', name: 'Demo User' });
    navigateTo('dashboard');
  };

  return (
    <div className="screen-container bg-light">
      <div className="screen-header">
        <button className="btn btn-link p-0 text-dark" onClick={() => navigateTo('welcome')}>
          <ArrowLeft size={24} />
        </button>
        <h5 className="screen-title mb-0">Đăng nhập</h5>
        <div style={{ width: '24px' }}></div>
      </div>

      <div className="p-4 fade-in">
        <div className="text-center mb-4 mt-3">
          <h2>Chào mừng trở lại!</h2>
          <p className="text-muted">Đăng nhập để tiếp tục</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="form-floating mb-3">
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label htmlFor="email">
              <Mail size={18} className="me-2" />
              Email
            </label>
          </div>

          <div className="form-floating mb-3">
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label htmlFor="password">
              <Lock size={18} className="me-2" />
              Mật khẩu
            </label>
          </div>

          <div className="text-end mb-3">
            <a href="#" className="text-decoration-none text-primary">Quên mật khẩu?</a>
          </div>

          <button type="submit" className="btn btn-primary w-100 py-3 rounded-pill mb-3">
            Đăng nhập
          </button>
        </form>

        <div className="text-center mb-3">
          <span className="text-muted">hoặc</span>
        </div>

        <button 
          className="btn btn-outline-secondary w-100 py-3 rounded-pill mb-3 d-flex align-items-center justify-content-center"
          onClick={handleGoogleLogin}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" className="me-2">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Đăng nhập với Google
        </button>

        <div className="text-center mt-4">
          <span className="text-muted">Chưa có tài khoản? </span>
          <a href="#" className="text-decoration-none" onClick={(e) => { e.preventDefault(); navigateTo('signup'); }}>
            Đăng ký ngay
          </a>
        </div>
      </div>
    </div>
  );
}

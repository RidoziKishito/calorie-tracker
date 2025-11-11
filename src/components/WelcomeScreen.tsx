import React from 'react';
import { Apple, Heart, TrendingUp } from 'lucide-react';
import { Screen } from '../App';

interface WelcomeScreenProps {
  navigateTo: (screen: Screen) => void;
}

export function WelcomeScreen({ navigateTo }: WelcomeScreenProps) {
  return (
    <div className="screen-container d-flex flex-column" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div className="flex-grow-1 d-flex flex-column justify-content-center align-items-center text-white p-4 fade-in">
        <div className="mb-4">
          <div className="d-flex justify-content-center mb-3">
            <div className="bg-white rounded-circle p-4" style={{ width: '100px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Apple size={50} className="text-success" />
            </div>
          </div>
          <h1 className="text-center mb-2">CalorieTracker</h1>
          <p className="text-center opacity-75">Theo dõi dinh dưỡng thông minh</p>
        </div>

        <div className="w-100 mt-4">
          <div className="d-flex align-items-start mb-4">
            <div className="bg-white bg-opacity-25 rounded-circle p-3 me-3">
              <Heart size={24} />
            </div>
            <div>
              <h5 className="mb-1">Quản lý calories dễ dàng</h5>
              <p className="opacity-75 mb-0" style={{ fontSize: '14px' }}>Theo dõi lượng calo và dinh dưỡng hàng ngày một cách đơn giản</p>
            </div>
          </div>

          <div className="d-flex align-items-start mb-4">
            <div className="bg-white bg-opacity-25 rounded-circle p-3 me-3">
              <TrendingUp size={24} />
            </div>
            <div>
              <h5 className="mb-1">Đạt được mục tiêu</h5>
              <p className="opacity-75 mb-0" style={{ fontSize: '14px' }}>Thiết lập và theo dõi tiến trình đạt mục tiêu của bạn</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4">
        <button 
          className="btn btn-light w-100 py-3 mb-3 rounded-pill"
          onClick={() => navigateTo('signup')}
        >
          Bắt đầu ngay
        </button>
        <button 
          className="btn btn-outline-light w-100 py-3 rounded-pill"
          onClick={() => navigateTo('login')}
        >
          Đã có tài khoản? Đăng nhập
        </button>
      </div>
    </div>
  );
}

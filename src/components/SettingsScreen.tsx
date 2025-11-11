import React, { useState } from 'react';
import { ArrowLeft, Bell, Camera, LogOut, User, Shield, HelpCircle, ChevronRight } from 'lucide-react';
import { Screen } from '../App';

interface SettingsScreenProps {
  navigateTo: (screen: Screen) => void;
}

export function SettingsScreen({ navigateTo }: SettingsScreenProps) {
  const [breakfastTime, setBreakfastTime] = useState('08:00');
  const [lunchTime, setLunchTime] = useState('12:00');
  const [dinnerTime, setDinnerTime] = useState('19:00');
  const [calorieWarning, setCalorieWarning] = useState(true);
  const [saveOriginalImages, setSaveOriginalImages] = useState(true);
  const [showReminders, setShowReminders] = useState(false);

  const handleLogout = () => {
    if (confirm('Bạn có chắc muốn đăng xuất?')) {
      navigateTo('welcome');
    }
  };

  return (
    <div className="screen-container bg-light">
      <div className="screen-header">
        <button className="btn btn-link p-0 text-dark" onClick={() => navigateTo('profile')}>
          <ArrowLeft size={24} />
        </button>
        <h5 className="screen-title mb-0">Cài đặt</h5>
        <div style={{ width: '24px' }}></div>
      </div>

      <div className="p-4 fade-in pb-5">
        {/* Account Section */}
        <div className="mb-4">
          <h6 className="text-muted mb-3">TÀI KHOẢN</h6>
          
          <div className="card border-0 shadow-sm mb-2">
            <div className="card-body d-flex align-items-center cursor-pointer" onClick={() => navigateTo('setup-profile')}>
              <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                <User size={20} className="text-primary" />
              </div>
              <div className="flex-grow-1">
                <div>Thông tin cá nhân</div>
                <small className="text-muted">Chỉnh sửa hồ sơ của bạn</small>
              </div>
              <ChevronRight size={20} className="text-muted" />
            </div>
          </div>

          <div className="card border-0 shadow-sm">
            <div className="card-body d-flex align-items-center cursor-pointer" onClick={() => navigateTo('goal-selection')}>
              <div className="bg-success bg-opacity-10 rounded-circle p-2 me-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-success">
                  <circle cx="12" cy="12" r="10"></circle>
                  <circle cx="12" cy="12" r="6"></circle>
                  <circle cx="12" cy="12" r="2"></circle>
                </svg>
              </div>
              <div className="flex-grow-1">
                <div>Mục tiêu</div>
                <small className="text-muted">Thay đổi mục tiêu của bạn</small>
              </div>
              <ChevronRight size={20} className="text-muted" />
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="text-muted mb-0">THÔNG BÁO</h6>
            <button 
              className="btn btn-sm btn-link p-0"
              onClick={() => setShowReminders(!showReminders)}
            >
              {showReminders ? 'Thu gọn' : 'Mở rộng'}
            </button>
          </div>
          
          <div className="card border-0 shadow-sm mb-2">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="d-flex align-items-center">
                  <div className="bg-warning bg-opacity-10 rounded-circle p-2 me-3">
                    <Bell size={20} className="text-warning" />
                  </div>
                  <div>
                    <div>Nhắc nhở ăn uống</div>
                    <small className="text-muted">Nhận thông báo nhắc ăn</small>
                  </div>
                </div>
                <div className="form-check form-switch">
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    checked={showReminders}
                    onChange={(e) => setShowReminders(e.target.checked)}
                  />
                </div>
              </div>

              {showReminders && (
                <div className="pt-3 border-top">
                  <div className="mb-3">
                    <label className="form-label small text-muted">Bữa sáng</label>
                    <input 
                      type="time" 
                      className="form-control"
                      value={breakfastTime}
                      onChange={(e) => setBreakfastTime(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small text-muted">Bữa trưa</label>
                    <input 
                      type="time" 
                      className="form-control"
                      value={lunchTime}
                      onChange={(e) => setLunchTime(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="form-label small text-muted">Bữa tối</label>
                    <input 
                      type="time" 
                      className="form-control"
                      value={dinnerTime}
                      onChange={(e) => setDinnerTime(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="card border-0 shadow-sm">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <div className="bg-danger bg-opacity-10 rounded-circle p-2 me-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-danger">
                    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
                </div>
                <div>
                  <div>Cảnh báo vượt calories</div>
                  <small className="text-muted">Thông báo khi vượt giới hạn</small>
                </div>
              </div>
              <div className="form-check form-switch">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  checked={calorieWarning}
                  onChange={(e) => setCalorieWarning(e.target.checked)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* App Settings */}
        <div className="mb-4">
          <h6 className="text-muted mb-3">ỨNG DỤNG</h6>
          
          <div className="card border-0 shadow-sm">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <div className="bg-info bg-opacity-10 rounded-circle p-2 me-3">
                  <Camera size={20} className="text-info" />
                </div>
                <div>
                  <div>Lưu ảnh gốc</div>
                  <small className="text-muted">Lưu ảnh món ăn đã chụp</small>
                </div>
              </div>
              <div className="form-check form-switch">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  checked={saveOriginalImages}
                  onChange={(e) => setSaveOriginalImages(e.target.checked)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Support Section */}
        <div className="mb-4">
          <h6 className="text-muted mb-3">HỖ TRỢ</h6>
          
          <div className="card border-0 shadow-sm mb-2">
            <div className="card-body d-flex align-items-center cursor-pointer">
              <div className="bg-secondary bg-opacity-10 rounded-circle p-2 me-3">
                <HelpCircle size={20} className="text-secondary" />
              </div>
              <div className="flex-grow-1">
                <div>Trung tâm trợ giúp</div>
                <small className="text-muted">Câu hỏi thường gặp</small>
              </div>
              <ChevronRight size={20} className="text-muted" />
            </div>
          </div>

          <div className="card border-0 shadow-sm">
            <div className="card-body d-flex align-items-center cursor-pointer">
              <div className="bg-secondary bg-opacity-10 rounded-circle p-2 me-3">
                <Shield size={20} className="text-secondary" />
              </div>
              <div className="flex-grow-1">
                <div>Chính sách bảo mật</div>
                <small className="text-muted">Xem chính sách của chúng tôi</small>
              </div>
              <ChevronRight size={20} className="text-muted" />
            </div>
          </div>
        </div>

        {/* App Info */}
        <div className="text-center mb-4">
          <small className="text-muted">
            CalorieTracker v1.0.0<br />
            © 2025 All rights reserved
          </small>
        </div>

        {/* Logout Button */}
        <button 
          className="btn btn-outline-danger w-100 py-3 rounded-pill"
          onClick={handleLogout}
        >
          <LogOut size={20} className="me-2" />
          Đăng xuất
        </button>
      </div>
    </div>
  );
}

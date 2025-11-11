import React from 'react';
import { Home, Camera, BookOpen, User, Calendar, Plus, TrendingUp, TrendingDown } from 'lucide-react';
import { Screen, UserProfile, FoodLog } from '../App';
import { BottomNav } from './BottomNav';

interface DashboardScreenProps {
  navigateTo: (screen: Screen) => void;
  userProfile: UserProfile;
  foodLogs: FoodLog[];
}

export function DashboardScreen({ navigateTo, userProfile, foodLogs }: DashboardScreenProps) {
  const today = new Date().toDateString();
  const todayLogs = foodLogs.filter(log => log.timestamp.toDateString() === today);
  
  const totalCalories = todayLogs.reduce((sum, log) => sum + log.calories, 0);
  const totalProtein = todayLogs.reduce((sum, log) => sum + log.protein, 0);
  const totalCarbs = todayLogs.reduce((sum, log) => sum + log.carbs, 0);
  const totalFat = todayLogs.reduce((sum, log) => sum + log.fat, 0);
  
  const dailyLimit = userProfile.dailyCalories || 2000;
  const percentage = Math.min((totalCalories / dailyLimit) * 100, 100);
  const remaining = Math.max(dailyLimit - totalCalories, 0);

  // Calculate SVG circle values
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  // Macro percentages
  const totalMacros = totalProtein + totalCarbs + totalFat;
  const proteinPercent = totalMacros > 0 ? (totalProtein / totalMacros) * 100 : 0;
  const carbsPercent = totalMacros > 0 ? (totalCarbs / totalMacros) * 100 : 0;
  const fatPercent = totalMacros > 0 ? (totalFat / totalMacros) * 100 : 0;

  const recentLogs = todayLogs.slice(0, 3);

  return (
    <div className="screen-container bg-light">
      <div className="screen-header bg-primary text-white">
        <h5 className="mb-0">Hôm nay</h5>
        <button 
          className="btn btn-link text-white p-0"
          onClick={() => navigateTo('settings')}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M12 1v6m0 6v6m-6-6h6m6 0h-6M4.93 4.93l4.24 4.24m5.66 5.66l4.24 4.24M4.93 19.07l4.24-4.24m5.66-5.66l4.24-4.24"></path>
          </svg>
        </button>
      </div>

      <div className="p-4 fade-in pb-5">
        {/* Greeting */}
        <div className="mb-4">
          <h3>Xin chào, {userProfile.name || 'bạn'}! 👋</h3>
          <p className="text-muted mb-0">{new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        {/* Calorie Progress Ring */}
        <div className="card mb-4 border-0 shadow-sm">
          <div className="card-body text-center py-4">
            <div className="progress-ring-container mb-3" style={{ display: 'inline-block', position: 'relative' }}>
              <svg width="160" height="160" style={{ transform: 'rotate(-90deg)' }}>
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke="#e9ecef"
                  strokeWidth="12"
                  fill="transparent"
                />
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke="#4CAF50"
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                />
              </svg>
              <div className="progress-ring-text">
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#212529' }}>
                  {totalCalories}
                </div>
                <div style={{ fontSize: '14px', color: '#6c757d' }}>
                  / {dailyLimit} kcal
                </div>
              </div>
            </div>
            
            <h5 className="mb-1">Calories tiêu thụ</h5>
            <p className="text-muted mb-0 small">Còn lại: {remaining} kcal</p>
          </div>
        </div>

        {/* Macros Chart */}
        <div className="card mb-4 border-0 shadow-sm">
          <div className="card-body">
            <h5 className="mb-3">Dinh dưỡng đa lượng</h5>
            
            {totalMacros > 0 ? (
              <>
                <div className="macro-bar mb-3">
                  <div className="macro-bar-protein" style={{ width: `${proteinPercent}%` }}></div>
                  <div className="macro-bar-carbs" style={{ width: `${carbsPercent}%` }}></div>
                  <div className="macro-bar-fat" style={{ width: `${fatPercent}%` }}></div>
                </div>

                <div className="row text-center g-3">
                  <div className="col-4">
                    <div className="d-flex align-items-center justify-content-center mb-2">
                      <div style={{ width: '12px', height: '12px', backgroundColor: '#FF9800', borderRadius: '50%', marginRight: '6px' }}></div>
                      <small className="text-muted">Protein</small>
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: '600' }}>{totalProtein.toFixed(0)}g</div>
                  </div>
                  <div className="col-4">
                    <div className="d-flex align-items-center justify-content-center mb-2">
                      <div style={{ width: '12px', height: '12px', backgroundColor: '#2196F3', borderRadius: '50%', marginRight: '6px' }}></div>
                      <small className="text-muted">Carbs</small>
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: '600' }}>{totalCarbs.toFixed(0)}g</div>
                  </div>
                  <div className="col-4">
                    <div className="d-flex align-items-center justify-content-center mb-2">
                      <div style={{ width: '12px', height: '12px', backgroundColor: '#9C27B0', borderRadius: '50%', marginRight: '6px' }}></div>
                      <small className="text-muted">Fat</small>
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: '600' }}>{totalFat.toFixed(0)}g</div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-3 text-muted">
                <p className="mb-0">Chưa có dữ liệu dinh dưỡng hôm nay</p>
              </div>
            )}
          </div>
        </div>

        {/* Suggestions */}
        {totalCalories > 0 && (
          <div className={`alert ${remaining > 500 ? 'alert-success' : remaining > 0 ? 'alert-warning' : 'alert-danger'} d-flex align-items-start mb-4`}>
            {remaining > 500 ? (
              <>
                <TrendingUp size={20} className="me-2 mt-1 flex-shrink-0" />
                <div className="small">
                  <strong>Gợi ý:</strong> Bạn còn {remaining} kcal. Có thể ăn thêm bữa phụ hoặc tăng khẩu phần!
                </div>
              </>
            ) : remaining > 0 ? (
              <>
                <TrendingDown size={20} className="me-2 mt-1 flex-shrink-0" />
                <div className="small">
                  <strong>Lưu ý:</strong> Bạn gần đạt giới hạn calories. Nên hạn chế ăn thêm!
                </div>
              </>
            ) : (
              <>
                <TrendingDown size={20} className="me-2 mt-1 flex-shrink-0" />
                <div className="small">
                  <strong>Cảnh báo:</strong> Bạn đã vượt giới hạn calories {Math.abs(remaining)} kcal!
                </div>
              </>
            )}
          </div>
        )}

        {/* Recent Logs */}
        <div className="card mb-4 border-0 shadow-sm">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">Món ăn gần đây</h5>
              <button 
                className="btn btn-link p-0 text-primary"
                onClick={() => navigateTo('pic-log')}
              >
                Xem tất cả
              </button>
            </div>

            {recentLogs.length > 0 ? (
              <div>
                {recentLogs.map((log) => (
                  <div key={log.id} className="d-flex align-items-center mb-3 pb-3 border-bottom">
                    <div 
                      className="rounded me-3 d-flex align-items-center justify-content-center"
                      style={{ 
                        width: '50px', 
                        height: '50px', 
                        backgroundColor: '#f8f9fa',
                        overflow: 'hidden'
                      }}
                    >
                      {log.imageUrl ? (
                        <img src={log.imageUrl} alt={log.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <Camera size={24} className="text-muted" />
                      )}
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="mb-1">{log.name}</h6>
                      <small className="text-muted">{log.portion} • {log.mealType}</small>
                    </div>
                    <div className="text-end">
                      <div style={{ fontSize: '16px', fontWeight: '600' }}>{log.calories}</div>
                      <small className="text-muted">kcal</small>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-muted">
                <Camera size={48} className="mb-3 opacity-25" />
                <p className="mb-0">Chưa có món ăn nào được ghi nhận</p>
                <small>Nhấn nút + để thêm món ăn</small>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FAB */}
      <button className="fab" onClick={() => navigateTo('quick-log')}>
        <Camera size={28} />
      </button>

      <BottomNav currentScreen="dashboard" navigateTo={navigateTo} />
    </div>
  );
}

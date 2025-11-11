import React from 'react';
import { User, TrendingUp, Award, Calendar, Settings } from 'lucide-react';
import { Screen, UserProfile, FoodLog } from '../App';
import { BottomNav } from './BottomNav';

interface ProfileScreenProps {
  navigateTo: (screen: Screen) => void;
  userProfile: UserProfile;
  foodLogs: FoodLog[];
}

export function ProfileScreen({ navigateTo, userProfile, foodLogs }: ProfileScreenProps) {
  // Calculate stats
  const totalDaysLogged = new Set(foodLogs.map(log => log.timestamp.toDateString())).size;
  const totalMeals = foodLogs.length;
  const totalCalories = foodLogs.reduce((sum, log) => sum + log.calories, 0);
  
  // Calculate streak
  const today = new Date();
  let streak = 0;
  let currentDate = new Date(today);
  
  while (streak < 365) {
    const dateStr = currentDate.toDateString();
    const hasLog = foodLogs.some(log => log.timestamp.toDateString() === dateStr);
    if (!hasLog) break;
    streak++;
    currentDate.setDate(currentDate.getDate() - 1);
  }

  // Mock weight progress data
  const weightProgress = [
    { week: 'T1', weight: userProfile.weight || 65 },
    { week: 'T2', weight: (userProfile.weight || 65) - 0.3 },
    { week: 'T3', weight: (userProfile.weight || 65) - 0.7 },
    { week: 'T4', weight: (userProfile.weight || 65) - 1.2 },
    { week: 'T5', weight: (userProfile.weight || 65) - 1.5 },
    { week: 'T6', weight: (userProfile.weight || 65) - 1.8 },
  ];

  const currentWeight = weightProgress[weightProgress.length - 1].weight;
  const startWeight = weightProgress[0].weight;
  const weightChange = currentWeight - startWeight;

  // Mock weekly calories data
  const weeklyCalories = [
    { day: 'CN', calories: 1850 },
    { day: 'T2', calories: 1920 },
    { day: 'T3', calories: 1880 },
    { day: 'T4', calories: 1950 },
    { day: 'T5', calories: 1900 },
    { day: 'T6', calories: 1870 },
    { day: 'T7', calories: 1890 },
  ];

  const maxCalories = Math.max(...weeklyCalories.map(d => d.calories));

  // Achievements
  const achievements = [
    { id: 1, icon: '🔥', title: 'Streak Master', description: `${streak} ngày liên tiếp`, earned: streak >= 3 },
    { id: 2, icon: '💪', title: 'Mục tiêu đầu tiên', description: 'Hoàn thành 7 ngày', earned: totalDaysLogged >= 7 },
    { id: 3, icon: '📸', title: 'Nhiếp ảnh gia', description: '50 món ăn', earned: totalMeals >= 50 },
    { id: 4, icon: '🎯', title: 'Kiên định', description: '30 ngày liên tiếp', earned: streak >= 30 },
    { id: 5, icon: '⭐', title: 'Chuyên gia', description: '100 món ăn', earned: totalMeals >= 100 },
    { id: 6, icon: '🏆', title: 'Huyền thoại', description: '365 ngày liên tiếp', earned: streak >= 365 },
  ];

  const activityLabels = {
    sedentary: 'Ít vận động',
    light: 'Nhẹ',
    moderate: 'Trung bình',
    active: 'Tích cực',
    'very-active': 'Rất tích cực'
  };

  const goalLabels = {
    maintain: 'Giữ cân',
    lose: 'Giảm cân',
    gain: 'Tăng cơ'
  };

  return (
    <div className="screen-container bg-light">
      <div className="screen-header">
        <h5 className="screen-title mb-0">Hồ sơ & Tiến trình</h5>
        <button 
          className="btn btn-link p-0 text-primary"
          onClick={() => navigateTo('settings')}
        >
          <Settings size={24} />
        </button>
      </div>

      <div className="fade-in pb-5">
        {/* Profile Card */}
        <div className="bg-primary text-white p-4 mb-3">
          <div className="d-flex align-items-center mb-3">
            <div 
              className="rounded-circle bg-white d-flex align-items-center justify-content-center me-3"
              style={{ width: '80px', height: '80px' }}
            >
              <User size={40} className="text-primary" />
            </div>
            <div>
              <h4 className="mb-1">{userProfile.name || 'User'}</h4>
              <p className="mb-0 opacity-75">{userProfile.email}</p>
            </div>
          </div>
          
          <div className="row text-center">
            <div className="col-4">
              <div className="opacity-75 small">Tuổi</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{userProfile.age || '-'}</div>
            </div>
            <div className="col-4">
              <div className="opacity-75 small">Chiều cao</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{userProfile.height || '-'}cm</div>
            </div>
            <div className="col-4">
              <div className="opacity-75 small">Cân nặng</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{userProfile.weight || '-'}kg</div>
            </div>
          </div>
        </div>

        <div className="px-4">
          {/* Stats */}
          <div className="row g-3 mb-4">
            <div className="col-4">
              <div className="card border-0 shadow-sm text-center">
                <div className="card-body">
                  <div style={{ fontSize: '24px' }}>🔥</div>
                  <h5 className="mb-0 mt-2">{streak}</h5>
                  <small className="text-muted">Streak</small>
                </div>
              </div>
            </div>
            <div className="col-4">
              <div className="card border-0 shadow-sm text-center">
                <div className="card-body">
                  <div style={{ fontSize: '24px' }}>📅</div>
                  <h5 className="mb-0 mt-2">{totalDaysLogged}</h5>
                  <small className="text-muted">Ngày</small>
                </div>
              </div>
            </div>
            <div className="col-4">
              <div className="card border-0 shadow-sm text-center">
                <div className="card-body">
                  <div style={{ fontSize: '24px' }}>🍽️</div>
                  <h5 className="mb-0 mt-2">{totalMeals}</h5>
                  <small className="text-muted">Món ăn</small>
                </div>
              </div>
            </div>
          </div>

          {/* Weight Progress */}
          <div className="card mb-4 border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0">
                  <TrendingUp size={18} className="me-2" />
                  Tiến trình cân nặng
                </h6>
                <span className={`badge ${weightChange < 0 ? 'bg-success' : weightChange > 0 ? 'bg-warning' : 'bg-secondary'}`}>
                  {weightChange > 0 ? '+' : ''}{weightChange.toFixed(1)} kg
                </span>
              </div>
              
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-2">
                  <small className="text-muted">Hiện tại</small>
                  <strong>{currentWeight.toFixed(1)} kg</strong>
                </div>
                <div className="progress" style={{ height: '6px' }}>
                  <div 
                    className="progress-bar bg-primary" 
                    style={{ width: '75%' }}
                  ></div>
                </div>
                <div className="d-flex justify-content-between mt-2">
                  <small className="text-muted">Bắt đầu: {startWeight} kg</small>
                  <small className="text-muted">Mục tiêu: {(startWeight - 5).toFixed(1)} kg</small>
                </div>
              </div>

              {/* Simple bar chart */}
              <div className="d-flex align-items-end justify-content-between" style={{ height: '100px', gap: '4px' }}>
                {weightProgress.map((item, index) => {
                  const maxWeight = Math.max(...weightProgress.map(w => w.weight));
                  const minWeight = Math.min(...weightProgress.map(w => w.weight));
                  const range = maxWeight - minWeight || 1;
                  const height = ((maxWeight - item.weight) / range * 80) + 20;
                  
                  return (
                    <div key={index} className="flex-grow-1 d-flex flex-column align-items-center">
                      <div 
                        className="w-100 bg-primary rounded"
                        style={{ height: `${height}px` }}
                      ></div>
                      <small className="text-muted mt-2">{item.week}</small>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Weekly Calories */}
          <div className="card mb-4 border-0 shadow-sm">
            <div className="card-body">
              <h6 className="mb-3">
                <Calendar size={18} className="me-2" />
                Calories tuần này
              </h6>
              
              <div className="d-flex align-items-end justify-content-between" style={{ height: '120px', gap: '4px' }}>
                {weeklyCalories.map((item, index) => {
                  const height = (item.calories / maxCalories * 100);
                  const targetCal = userProfile.dailyCalories || 2000;
                  const isOverTarget = item.calories > targetCal;
                  
                  return (
                    <div key={index} className="flex-grow-1 d-flex flex-column align-items-center">
                      <small className="text-muted mb-1" style={{ fontSize: '10px' }}>
                        {item.calories}
                      </small>
                      <div 
                        className={`w-100 rounded ${isOverTarget ? 'bg-warning' : 'bg-success'}`}
                        style={{ height: `${height}%` }}
                      ></div>
                      <small className="text-muted mt-2">{item.day}</small>
                    </div>
                  );
                })}
              </div>

              <div className="text-center mt-3">
                <small className="text-muted">
                  Trung bình: {Math.round(weeklyCalories.reduce((sum, d) => sum + d.calories, 0) / weeklyCalories.length)} kcal/ngày
                </small>
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="card mb-4 border-0 shadow-sm">
            <div className="card-body">
              <h6 className="mb-3">
                <Award size={18} className="me-2" />
                Thành tích
              </h6>
              
              <div className="row g-3">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className="col-4">
                    <div 
                      className={`text-center p-3 rounded ${achievement.earned ? 'bg-primary bg-opacity-10' : 'bg-light'}`}
                      style={{ opacity: achievement.earned ? 1 : 0.5 }}
                    >
                      <div style={{ fontSize: '32px', marginBottom: '8px' }}>
                        {achievement.icon}
                      </div>
                      <div style={{ fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>
                        {achievement.title}
                      </div>
                      <div style={{ fontSize: '10px' }} className="text-muted">
                        {achievement.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="card mb-4 border-0 shadow-sm">
            <div className="card-body">
              <h6 className="mb-3">Thông tin chi tiết</h6>
              
              <div className="mb-3">
                <small className="text-muted">Mức độ vận động</small>
                <div>{activityLabels[userProfile.activityLevel || 'moderate']}</div>
              </div>

              <div className="mb-3">
                <small className="text-muted">Mục tiêu</small>
                <div>{goalLabels[userProfile.goal || 'maintain']}</div>
              </div>

              <div className="mb-3">
                <small className="text-muted">Calories khuyến nghị</small>
                <div>{userProfile.dailyCalories || 2000} kcal/ngày</div>
              </div>

              <div>
                <small className="text-muted">Tổng calories đã tiêu thụ</small>
                <div>{totalCalories.toLocaleString()} kcal</div>
              </div>
            </div>
          </div>

          {/* Export button */}
          <button className="btn btn-outline-primary w-100 mb-3 rounded-pill py-3">
            Xuất dữ liệu (CSV/PDF)
          </button>
        </div>
      </div>

      <BottomNav currentScreen="profile" navigateTo={navigateTo} />
    </div>
  );
}

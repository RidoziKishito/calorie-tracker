import React, { useState } from 'react';
import { ArrowLeft, Target, TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { Screen, UserProfile } from '../App';

interface GoalSelectionScreenProps {
  navigateTo: (screen: Screen) => void;
  userProfile: UserProfile;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
}

export function GoalSelectionScreen({ navigateTo, userProfile, updateUserProfile }: GoalSelectionScreenProps) {
  const [selectedGoal, setSelectedGoal] = useState<'maintain' | 'lose' | 'gain'>(userProfile.goal || 'maintain');

  const calculateDailyCalories = (goal: 'maintain' | 'lose' | 'gain') => {
    // Basic BMR calculation using Mifflin-St Jeor Equation
    const { age = 25, gender = 'male', height = 170, weight = 65, activityLevel = 'moderate' } = userProfile;
    
    let bmr: number;
    if (gender === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    // Activity multipliers
    const activityMultipliers = {
      'sedentary': 1.2,
      'light': 1.375,
      'moderate': 1.55,
      'active': 1.725,
      'very-active': 1.9
    };

    const tdee = bmr * activityMultipliers[activityLevel];

    // Adjust based on goal
    if (goal === 'lose') {
      return Math.round(tdee - 500); // 500 calorie deficit
    } else if (goal === 'gain') {
      return Math.round(tdee + 300); // 300 calorie surplus
    }
    return Math.round(tdee);
  };

  const handleContinue = () => {
    const dailyCalories = calculateDailyCalories(selectedGoal);
    updateUserProfile({ goal: selectedGoal, dailyCalories });
    navigateTo('dashboard');
  };

  const goals = [
    {
      id: 'maintain' as const,
      icon: Minus,
      title: 'Giữ cân',
      description: 'Duy trì cân nặng hiện tại',
      color: '#2196F3',
      bgColor: '#E3F2FD'
    },
    {
      id: 'lose' as const,
      icon: TrendingDown,
      title: 'Giảm cân',
      description: 'Giảm mỡ và cải thiện sức khỏe',
      color: '#FF9800',
      bgColor: '#FFF3E0'
    },
    {
      id: 'gain' as const,
      icon: TrendingUp,
      title: 'Tăng cơ',
      description: 'Xây dựng cơ bắp và tăng sức mạnh',
      color: '#4CAF50',
      bgColor: '#E8F5E9'
    }
  ];

  return (
    <div className="screen-container bg-light">
      <div className="screen-header">
        <button className="btn btn-link p-0 text-dark" onClick={() => navigateTo('setup-profile')}>
          <ArrowLeft size={24} />
        </button>
        <h5 className="screen-title mb-0">Chọn mục tiêu</h5>
        <div style={{ width: '24px' }}></div>
      </div>

      <div className="p-4 fade-in">
        <div className="text-center mb-4 mt-3">
          <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex p-3 mb-3">
            <Target size={40} className="text-primary" />
          </div>
          <h2>Mục tiêu của bạn</h2>
          <p className="text-muted">Chọn mục tiêu phù hợp với bạn nhất</p>
        </div>

        <div className="mb-4">
          {goals.map((goal) => {
            const Icon = goal.icon;
            const isSelected = selectedGoal === goal.id;
            
            return (
              <div
                key={goal.id}
                className={`card mb-3 cursor-pointer ${isSelected ? 'border-primary' : ''}`}
                style={{
                  borderWidth: isSelected ? '2px' : '1px',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
                onClick={() => setSelectedGoal(goal.id)}
              >
                <div className="card-body d-flex align-items-center">
                  <div 
                    className="rounded-circle p-3 me-3"
                    style={{ backgroundColor: goal.bgColor }}
                  >
                    <Icon size={28} style={{ color: goal.color }} />
                  </div>
                  <div className="flex-grow-1">
                    <h5 className="mb-1">{goal.title}</h5>
                    <p className="text-muted mb-0 small">{goal.description}</p>
                  </div>
                  {isSelected && (
                    <div 
                      className="rounded-circle d-flex align-items-center justify-content-center"
                      style={{ 
                        width: '24px', 
                        height: '24px', 
                        backgroundColor: goal.color 
                      }}
                    >
                      <svg 
                        width="14" 
                        height="14" 
                        viewBox="0 0 14 14" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path 
                          d="M11.6667 3.5L5.25 9.91667L2.33333 7" 
                          stroke="white" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="alert alert-info d-flex align-items-start mb-4">
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 20 20" 
            fill="currentColor" 
            className="me-2 mt-1 flex-shrink-0"
          >
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div className="small">
            <strong>Lưu ý:</strong> Lượng calories khuyến nghị sẽ được tính tự động dựa trên thông tin và mục tiêu của bạn.
          </div>
        </div>

        <div className="card mb-4 bg-light border-0">
          <div className="card-body text-center">
            <p className="text-muted mb-2 small">Calories khuyến nghị hàng ngày</p>
            <h1 className="text-primary mb-0">{calculateDailyCalories(selectedGoal)}</h1>
            <p className="text-muted small mb-0">kcal/ngày</p>
          </div>
        </div>

        <button 
          className="btn btn-primary w-100 py-3 rounded-pill"
          onClick={handleContinue}
        >
          Hoàn thành thiết lập
        </button>
      </div>
    </div>
  );
}

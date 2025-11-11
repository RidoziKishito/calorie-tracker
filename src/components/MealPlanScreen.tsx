import React, { useState } from 'react';
import { Calendar, RefreshCw, ChevronRight } from 'lucide-react';
import { Screen, UserProfile } from '../App';
import { BottomNav } from './BottomNav';

interface MealPlanScreenProps {
  navigateTo: (screen: Screen) => void;
  userProfile: UserProfile;
}

interface Meal {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  description: string;
}

interface DayPlan {
  day: string;
  date: string;
  breakfast: Meal;
  lunch: Meal;
  dinner: Meal;
  totalCalories: number;
}

export function MealPlanScreen({ navigateTo, userProfile }: MealPlanScreenProps) {
  const [selectedDay, setSelectedDay] = useState(0);

  // Mock meal plans based on goal
  const generateMealPlans = (): DayPlan[] => {
    const goal = userProfile.goal || 'maintain';
    
    const mealDatabase = {
      lose: {
        breakfast: [
          { name: 'Yến mạch với trái cây', calories: 250, protein: 8, carbs: 45, fat: 5, description: 'Yến mạch, chuối, dâu tây, sữa tươi' },
          { name: 'Trứng luộc & bánh mì nguyên cám', calories: 280, protein: 15, carbs: 35, fat: 8, description: '2 trứng luộc, 2 lát bánh mì nguyên cám' },
          { name: 'Sữa chua Hy Lạp với hạt', calories: 220, protein: 18, carbs: 20, fat: 8, description: 'Sữa chua Hy Lạp, hạt chia, hạnh nhân' },
        ],
        lunch: [
          { name: 'Salad gà nướng', calories: 350, protein: 35, carbs: 25, fat: 12, description: 'Ức gà nướng, rau xanh, cà chua, dầu olive' },
          { name: 'Cơm gạo lứt & cá hồi', calories: 420, protein: 30, carbs: 40, fat: 15, description: 'Cá hồi nướng, cơm gạo lứt, rau củ luộc' },
          { name: 'Phở gà không mỡ', calories: 380, protein: 32, carbs: 45, fat: 8, description: 'Phở gà, ít bánh phở, nhiều rau thơm' },
        ],
        dinner: [
          { name: 'Ức gà áp chảo & rau', calories: 320, protein: 38, carbs: 20, fat: 10, description: 'Ức gà, bông cải xanh, cà rót' },
          { name: 'Tôm hấp & salad', calories: 280, protein: 30, carbs: 18, fat: 8, description: 'Tôm hấp, salad rau trộn' },
          { name: 'Cá diêu hồng nướng', calories: 310, protein: 35, carbs: 15, fat: 12, description: 'Cá nướng, rau củ luộc' },
        ]
      },
      maintain: {
        breakfast: [
          { name: 'Bánh mì trứng', calories: 350, protein: 15, carbs: 45, fat: 12, description: 'Bánh mì, trứng ốp la, pate' },
          { name: 'Phở bò', calories: 400, protein: 20, carbs: 55, fat: 10, description: 'Phở bò tái, rau thơm' },
          { name: 'Xôi gà', calories: 380, protein: 18, carbs: 50, fat: 12, description: 'Xôi gà, đậu phộng' },
        ],
        lunch: [
          { name: 'Cơm gà xối mỡ', calories: 520, protein: 35, carbs: 58, fat: 18, description: 'Cơm trắng, gà xối mỡ, canh' },
          { name: 'Bún chả', calories: 480, protein: 28, carbs: 55, fat: 16, description: 'Bún, chả nướng, nem, nước mắm' },
          { name: 'Cơm sườn', calories: 550, protein: 32, carbs: 60, fat: 20, description: 'Cơm trắng, sườn nướng, trứng' },
        ],
        dinner: [
          { name: 'Cơm rang thập cẩm', calories: 450, protein: 20, carbs: 55, fat: 15, description: 'Cơm rang, tôm, xúc xích, rau củ' },
          { name: 'Mì Ý sốt bò bằm', calories: 500, protein: 25, carbs: 60, fat: 18, description: 'Mì Ý, sốt cà chua, thịt bò bằm' },
          { name: 'Lẩu gà', calories: 420, protein: 35, carbs: 30, fat: 18, description: 'Gà, rau củ, nấm, miến' },
        ]
      },
      gain: {
        breakfast: [
          { name: 'Bánh mì thịt nguội phô mai', calories: 480, protein: 22, carbs: 50, fat: 20, description: 'Bánh mì, thịt nguội, phô mai, trứng' },
          { name: 'Cháo gà nấm', calories: 420, protein: 25, carbs: 55, fat: 12, description: 'Cháo gà, nấm, trứng, hành phi' },
          { name: 'Bún bò Huế', calories: 550, protein: 28, carbs: 65, fat: 18, description: 'Bún bò, giò heo, chả' },
        ],
        lunch: [
          { name: 'Cơm gà teriyaki', calories: 650, protein: 40, carbs: 75, fat: 20, description: 'Cơm trắng, gà teriyaki, salad' },
          { name: 'Bún đậu mắm tôm', calories: 620, protein: 35, carbs: 70, fat: 22, description: 'Bún, đậu rán, nem, chả' },
          { name: 'Cơm chiên dương châu', calories: 680, protein: 30, carbs: 80, fat: 25, description: 'Cơm chiên, tôm, xúc xích, trứng' },
        ],
        dinner: [
          { name: 'Bít tết & khoai tây', calories: 720, protein: 45, carbs: 60, fat: 30, description: 'Bít tết bò, khoai tây chiên, salad' },
          { name: 'Cơm gà rán', calories: 650, protein: 38, carbs: 65, fat: 25, description: 'Cơm trắng, gà rán giòn, rau củ' },
          { name: 'Mì xào bò', calories: 620, protein: 35, carbs: 70, fat: 22, description: 'Mì xào, thịt bò, rau củ' },
        ]
      }
    };

    const meals = mealDatabase[goal];
    const plans: DayPlan[] = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const breakfast = meals.breakfast[i % meals.breakfast.length];
      const lunch = meals.lunch[i % meals.lunch.length];
      const dinner = meals.dinner[i % meals.dinner.length];
      
      plans.push({
        day: date.toLocaleDateString('vi-VN', { weekday: 'long' }),
        date: date.toLocaleDateString('vi-VN', { day: 'numeric', month: 'numeric' }),
        breakfast,
        lunch,
        dinner,
        totalCalories: breakfast.calories + lunch.calories + dinner.calories
      });
    }

    return plans;
  };

  const [mealPlans, setMealPlans] = useState<DayPlan[]>(generateMealPlans());

  const handleRegenerate = () => {
    setMealPlans(generateMealPlans());
  };

  const goalLabels = {
    maintain: 'Giữ cân',
    lose: 'Giảm cân',
    gain: 'Tăng cơ',
  };

  const currentPlan = mealPlans[selectedDay];

  return (
    <div className="screen-container bg-light">
      <div className="screen-header">
        <h5 className="screen-title mb-0">Thực đơn gợi ý</h5>
        <button 
          className="btn btn-link p-0 text-primary"
          onClick={handleRegenerate}
        >
          <RefreshCw size={24} />
        </button>
      </div>

      <div className="fade-in pb-5">
        {/* Goal Banner */}
        <div className="bg-primary text-white p-3 mb-3">
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <small className="opacity-75">Mục tiêu hiện tại</small>
              <h6 className="mb-0">{goalLabels[userProfile.goal || 'maintain']}</h6>
            </div>
            <div className="text-end">
              <small className="opacity-75">Calories khuyến nghị</small>
              <h6 className="mb-0">{userProfile.dailyCalories || 2000} kcal</h6>
            </div>
          </div>
        </div>

        {/* Day Tabs */}
        <div className="px-3 mb-3" style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
          <div className="d-inline-flex gap-2">
            {mealPlans.map((plan, index) => (
              <button
                key={index}
                className={`btn ${selectedDay === index ? 'btn-primary' : 'btn-outline-primary'}`}
                style={{ borderRadius: '20px', minWidth: '100px' }}
                onClick={() => setSelectedDay(index)}
              >
                <div style={{ fontSize: '12px' }}>{plan.day}</div>
                <div style={{ fontSize: '10px' }}>{plan.date}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Current Day Plan */}
        <div className="px-4">
          <div className="card mb-3 border-0 shadow-sm">
            <div className="card-body text-center">
              <small className="text-muted">Tổng calories</small>
              <h3 className="text-primary mb-0">{currentPlan.totalCalories}</h3>
              <small className="text-muted">kcal/ngày</small>
            </div>
          </div>

          {/* Breakfast */}
          <div className="card mb-3 border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div className="d-flex align-items-center">
                  <div 
                    className="rounded-circle me-3"
                    style={{ width: '40px', height: '40px', backgroundColor: '#FFF3E0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <span style={{ fontSize: '20px' }}>🌅</span>
                  </div>
                  <div>
                    <h6 className="mb-0">Bữa sáng</h6>
                    <small className="text-muted">7:00 - 9:00</small>
                  </div>
                </div>
                <div className="text-end">
                  <div style={{ fontWeight: 'bold' }}>{currentPlan.breakfast.calories}</div>
                  <small className="text-muted">kcal</small>
                </div>
              </div>
              
              <h6 className="mb-2">{currentPlan.breakfast.name}</h6>
              <p className="text-muted mb-3 small">{currentPlan.breakfast.description}</p>
              
              <div className="d-flex justify-content-between small">
                <div>
                  <span className="text-muted">P:</span> <strong>{currentPlan.breakfast.protein}g</strong>
                </div>
                <div>
                  <span className="text-muted">C:</span> <strong>{currentPlan.breakfast.carbs}g</strong>
                </div>
                <div>
                  <span className="text-muted">F:</span> <strong>{currentPlan.breakfast.fat}g</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Lunch */}
          <div className="card mb-3 border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div className="d-flex align-items-center">
                  <div 
                    className="rounded-circle me-3"
                    style={{ width: '40px', height: '40px', backgroundColor: '#E3F2FD', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <span style={{ fontSize: '20px' }}>☀️</span>
                  </div>
                  <div>
                    <h6 className="mb-0">Bữa trưa</h6>
                    <small className="text-muted">11:30 - 13:00</small>
                  </div>
                </div>
                <div className="text-end">
                  <div style={{ fontWeight: 'bold' }}>{currentPlan.lunch.calories}</div>
                  <small className="text-muted">kcal</small>
                </div>
              </div>
              
              <h6 className="mb-2">{currentPlan.lunch.name}</h6>
              <p className="text-muted mb-3 small">{currentPlan.lunch.description}</p>
              
              <div className="d-flex justify-content-between small">
                <div>
                  <span className="text-muted">P:</span> <strong>{currentPlan.lunch.protein}g</strong>
                </div>
                <div>
                  <span className="text-muted">C:</span> <strong>{currentPlan.lunch.carbs}g</strong>
                </div>
                <div>
                  <span className="text-muted">F:</span> <strong>{currentPlan.lunch.fat}g</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Dinner */}
          <div className="card mb-3 border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div className="d-flex align-items-center">
                  <div 
                    className="rounded-circle me-3"
                    style={{ width: '40px', height: '40px', backgroundColor: '#F3E5F5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <span style={{ fontSize: '20px' }}>🌙</span>
                  </div>
                  <div>
                    <h6 className="mb-0">Bữa tối</h6>
                    <small className="text-muted">18:00 - 20:00</small>
                  </div>
                </div>
                <div className="text-end">
                  <div style={{ fontWeight: 'bold' }}>{currentPlan.dinner.calories}</div>
                  <small className="text-muted">kcal</small>
                </div>
              </div>
              
              <h6 className="mb-2">{currentPlan.dinner.name}</h6>
              <p className="text-muted mb-3 small">{currentPlan.dinner.description}</p>
              
              <div className="d-flex justify-content-between small">
                <div>
                  <span className="text-muted">P:</span> <strong>{currentPlan.dinner.protein}g</strong>
                </div>
                <div>
                  <span className="text-muted">C:</span> <strong>{currentPlan.dinner.carbs}g</strong>
                </div>
                <div>
                  <span className="text-muted">F:</span> <strong>{currentPlan.dinner.fat}g</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="alert alert-info">
            <small>
              <strong>💡 Mẹo:</strong> Thực đơn này chỉ mang tính chất tham khảo. Bạn có thể điều chỉnh phù hợp với sở thích và điều kiện của mình.
            </small>
          </div>
        </div>
      </div>

      <BottomNav currentScreen="meal-plan" navigateTo={navigateTo} />
    </div>
  );
}

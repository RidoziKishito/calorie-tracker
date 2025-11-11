import React, { useState } from 'react';
import { ArrowLeft, Plus } from 'lucide-react';
import { Screen, FoodLog } from '../App';

interface ManualLogScreenProps {
  navigateTo: (screen: Screen) => void;
  addFoodLog: (log: Omit<FoodLog, 'id' | 'timestamp'>) => void;
}

export function ManualLogScreen({ navigateTo, addFoodLog }: ManualLogScreenProps) {
  const [name, setName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [portion, setPortion] = useState('1 phần');
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('lunch');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    addFoodLog({
      name,
      calories: Number(calories),
      protein: Number(protein) || 0,
      carbs: Number(carbs) || 0,
      fat: Number(fat) || 0,
      portion,
      mealType,
    });
    
    navigateTo('dashboard');
  };

  // Quick add buttons
  const quickAddItems = [
    { name: 'Cơm trắng', calories: 200, protein: 4, carbs: 45, fat: 0.5, portion: '1 bát' },
    { name: 'Trứng gà', calories: 70, protein: 6, carbs: 0.5, fat: 5, portion: '1 quả' },
    { name: 'Ức gà luộc', calories: 165, protein: 31, carbs: 0, fat: 3.6, portion: '100g' },
    { name: 'Chuối', calories: 89, protein: 1, carbs: 23, fat: 0.3, portion: '1 quả' },
  ];

  const handleQuickAdd = (item: typeof quickAddItems[0]) => {
    setName(item.name);
    setCalories(item.calories.toString());
    setProtein(item.protein.toString());
    setCarbs(item.carbs.toString());
    setFat(item.fat.toString());
    setPortion(item.portion);
  };

  return (
    <div className="screen-container bg-light">
      <div className="screen-header">
        <button className="btn btn-link p-0 text-dark" onClick={() => navigateTo('dashboard')}>
          <ArrowLeft size={24} />
        </button>
        <h5 className="screen-title mb-0">Thêm thủ công</h5>
        <div style={{ width: '24px' }}></div>
      </div>

      <div className="p-4 fade-in pb-5">
        <div className="mb-4">
          <h6 className="mb-3">Thêm nhanh</h6>
          <div className="row g-2">
            {quickAddItems.map((item, index) => (
              <div key={index} className="col-6">
                <button
                  className="btn btn-outline-primary w-100 text-start p-3"
                  style={{ height: '100%' }}
                  onClick={() => handleQuickAdd(item)}
                >
                  <div className="d-flex align-items-start">
                    <Plus size={16} className="me-2 mt-1 flex-shrink-0" />
                    <div>
                      <div className="small mb-1">{item.name}</div>
                      <div className="text-muted" style={{ fontSize: '12px' }}>{item.calories} kcal</div>
                    </div>
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <h6 className="mb-3">Thông tin món ăn</h6>

          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              id="name"
              placeholder="Tên món ăn"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <label htmlFor="name">Tên món ăn</label>
          </div>

          <div className="row g-3 mb-3">
            <div className="col-6">
              <div className="form-floating">
                <input
                  type="number"
                  className="form-control"
                  id="calories"
                  placeholder="Calories"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                  required
                  min="0"
                />
                <label htmlFor="calories">Calories (kcal)</label>
              </div>
            </div>
            <div className="col-6">
              <div className="form-floating">
                <input
                  type="text"
                  className="form-control"
                  id="portion"
                  placeholder="Khẩu phần"
                  value={portion}
                  onChange={(e) => setPortion(e.target.value)}
                />
                <label htmlFor="portion">Khẩu phần</label>
              </div>
            </div>
          </div>

          <h6 className="mb-3">Dinh dưỡng (tùy chọn)</h6>

          <div className="row g-3 mb-3">
            <div className="col-4">
              <div className="form-floating">
                <input
                  type="number"
                  className="form-control"
                  id="protein"
                  placeholder="Protein"
                  value={protein}
                  onChange={(e) => setProtein(e.target.value)}
                  min="0"
                  step="0.1"
                />
                <label htmlFor="protein">Protein (g)</label>
              </div>
            </div>
            <div className="col-4">
              <div className="form-floating">
                <input
                  type="number"
                  className="form-control"
                  id="carbs"
                  placeholder="Carbs"
                  value={carbs}
                  onChange={(e) => setCarbs(e.target.value)}
                  min="0"
                  step="0.1"
                />
                <label htmlFor="carbs">Carbs (g)</label>
              </div>
            </div>
            <div className="col-4">
              <div className="form-floating">
                <input
                  type="number"
                  className="form-control"
                  id="fat"
                  placeholder="Fat"
                  value={fat}
                  onChange={(e) => setFat(e.target.value)}
                  min="0"
                  step="0.1"
                />
                <label htmlFor="fat">Fat (g)</label>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label">Bữa ăn</label>
            <select 
              className="form-select"
              value={mealType}
              onChange={(e) => setMealType(e.target.value as any)}
            >
              <option value="breakfast">Bữa sáng</option>
              <option value="lunch">Bữa trưa</option>
              <option value="dinner">Bữa tối</option>
              <option value="snack">Bữa phụ</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary w-100 py-3 rounded-pill">
            Lưu món ăn
          </button>
        </form>
      </div>
    </div>
  );
}

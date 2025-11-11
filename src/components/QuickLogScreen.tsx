import React, { useState } from 'react';
import { ArrowLeft, Camera, Upload, Check } from 'lucide-react';
import { Screen, FoodLog } from '../App';

interface QuickLogScreenProps {
  navigateTo: (screen: Screen) => void;
  addFoodLog: (log: Omit<FoodLog, 'id' | 'timestamp'>) => void;
}

type Step = 'capture' | 'loading' | 'recognition' | 'portion' | 'confirm';

interface FoodSuggestion {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export function QuickLogScreen({ navigateTo, addFoodLog }: QuickLogScreenProps) {
  const [step, setStep] = useState<Step>('capture');
  const [imagePreview, setImagePreview] = useState<string>('');
  const [suggestions, setSuggestions] = useState<FoodSuggestion[]>([]);
  const [selectedFood, setSelectedFood] = useState<FoodSuggestion | null>(null);
  const [portion, setPortion] = useState<'small' | 'medium' | 'large'>('medium');
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('lunch');

  const handleImageCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setStep('loading');
        
        // Simulate AI recognition
        setTimeout(() => {
          // Mock suggestions
          const mockSuggestions: FoodSuggestion[] = [
            { name: 'Cơm gà', calories: 450, protein: 35, carbs: 52, fat: 12 },
            { name: 'Cơm sườn', calories: 520, protein: 32, carbs: 58, fat: 18 },
            { name: 'Cơm chiên', calories: 380, protein: 12, carbs: 55, fat: 14 },
          ];
          setSuggestions(mockSuggestions);
          setStep('recognition');
        }, 2000);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFoodSelect = (food: FoodSuggestion) => {
    setSelectedFood(food);
    setStep('portion');
  };

  const handlePortionSelect = (selectedPortion: 'small' | 'medium' | 'large') => {
    setPortion(selectedPortion);
    setStep('confirm');
  };

  const portionMultipliers = {
    small: 0.7,
    medium: 1.0,
    large: 1.3,
  };

  const portionLabels = {
    small: 'Nhỏ (70%)',
    medium: 'Vừa (100%)',
    large: 'Lớn (130%)',
  };

  const handleConfirm = () => {
    if (selectedFood) {
      const multiplier = portionMultipliers[portion];
      addFoodLog({
        name: selectedFood.name,
        calories: Math.round(selectedFood.calories * multiplier),
        protein: Math.round(selectedFood.protein * multiplier),
        carbs: Math.round(selectedFood.carbs * multiplier),
        fat: Math.round(selectedFood.fat * multiplier),
        portion: portionLabels[portion],
        mealType,
        imageUrl: imagePreview,
      });
      navigateTo('dashboard');
    }
  };

  return (
    <div className="screen-container bg-light">
      <div className="screen-header">
        <button className="btn btn-link p-0 text-dark" onClick={() => navigateTo('dashboard')}>
          <ArrowLeft size={24} />
        </button>
        <h5 className="screen-title mb-0">Ghi nhận món ăn</h5>
        <button 
          className="btn btn-link p-0 text-primary"
          onClick={() => navigateTo('manual-log')}
        >
          Thủ công
        </button>
      </div>

      <div className="p-4 fade-in pb-5">
        {/* Capture Step */}
        {step === 'capture' && (
          <div className="text-center">
            <div 
              className="border border-2 border-dashed rounded-3 p-5 mb-3"
              style={{ borderColor: '#dee2e6' }}
            >
              <Camera size={64} className="text-muted mb-3" />
              <h5 className="mb-2">Chụp ảnh món ăn</h5>
              <p className="text-muted mb-4">AI sẽ tự động nhận diện món ăn và tính calories</p>
              
              <label className="btn btn-primary mb-2 w-100 py-3 rounded-pill">
                <Camera size={20} className="me-2" />
                Chụp ảnh
                <input 
                  type="file" 
                  accept="image/*" 
                  capture="environment"
                  className="d-none"
                  onChange={handleImageCapture}
                />
              </label>
              
              <label className="btn btn-outline-primary w-100 py-3 rounded-pill">
                <Upload size={20} className="me-2" />
                Tải ảnh lên
                <input 
                  type="file" 
                  accept="image/*"
                  className="d-none"
                  onChange={handleImageCapture}
                />
              </label>
            </div>

            <div className="alert alert-info">
              <small>
                <strong>Mẹo:</strong> Chụp ảnh món ăn từ phía trên, đảm bảo ánh sáng tốt để AI nhận diện chính xác hơn.
              </small>
            </div>
          </div>
        )}

        {/* Loading Step */}
        {step === 'loading' && (
          <div className="text-center">
            {imagePreview && (
              <img src={imagePreview} alt="Preview" className="image-preview mb-4" />
            )}
            <div className="spinner-custom"></div>
            <h5 className="mt-3">Đang phân tích...</h5>
            <p className="text-muted">AI đang nhận diện món ăn của bạn</p>
          </div>
        )}

        {/* Recognition Step */}
        {step === 'recognition' && (
          <div>
            {imagePreview && (
              <img src={imagePreview} alt="Preview" className="image-preview mb-4" />
            )}
            
            <h5 className="mb-3">Món ăn được nhận diện</h5>
            <p className="text-muted mb-3">Chọn món ăn phù hợp nhất</p>

            {suggestions.map((food, index) => (
              <div
                key={index}
                className="card mb-3 card-hover"
                onClick={() => handleFoodSelect(food)}
              >
                <div className="card-body d-flex align-items-center">
                  <div className="flex-grow-1">
                    <h6 className="mb-1">{food.name}</h6>
                    <small className="text-muted">
                      {food.calories} kcal • P: {food.protein}g • C: {food.carbs}g • F: {food.fat}g
                    </small>
                  </div>
                  <svg 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2"
                  >
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </div>
              </div>
            ))}

            <button 
              className="btn btn-outline-secondary w-100 py-3 rounded-pill mt-2"
              onClick={() => navigateTo('manual-log')}
            >
              Không đúng? Nhập thủ công
            </button>
          </div>
        )}

        {/* Portion Step */}
        {step === 'portion' && selectedFood && (
          <div>
            {imagePreview && (
              <img src={imagePreview} alt="Preview" className="image-preview mb-4" />
            )}
            
            <div className="card mb-4 bg-light border-0">
              <div className="card-body text-center">
                <h5 className="mb-1">{selectedFood.name}</h5>
                <small className="text-muted">Chọn khẩu phần</small>
              </div>
            </div>

            <h5 className="mb-3">Kích thước khẩu phần</h5>

            {(['small', 'medium', 'large'] as const).map((size) => {
              const multiplier = portionMultipliers[size];
              const calories = Math.round(selectedFood.calories * multiplier);
              
              return (
                <div
                  key={size}
                  className={`card mb-3 card-hover ${portion === size ? 'border-primary' : ''}`}
                  style={{ borderWidth: portion === size ? '2px' : '1px' }}
                  onClick={() => handlePortionSelect(size)}
                >
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="mb-1">{portionLabels[size]}</h6>
                        <small className="text-muted">{calories} kcal</small>
                      </div>
                      {portion === size && (
                        <div 
                          className="rounded-circle d-flex align-items-center justify-content-center bg-primary"
                          style={{ width: '24px', height: '24px' }}
                        >
                          <Check size={16} color="white" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            <button 
              className="btn btn-primary w-100 py-3 rounded-pill mt-3"
              onClick={() => setStep('confirm')}
            >
              Tiếp tục
            </button>
          </div>
        )}

        {/* Confirm Step */}
        {step === 'confirm' && selectedFood && (
          <div>
            {imagePreview && (
              <img src={imagePreview} alt="Preview" className="image-preview mb-4" />
            )}
            
            <h5 className="mb-3">Xác nhận thông tin</h5>

            <div className="card mb-3 border-0 shadow-sm">
              <div className="card-body">
                <h5 className="mb-3">{selectedFood.name}</h5>
                
                <div className="row mb-3">
                  <div className="col-6">
                    <small className="text-muted">Khẩu phần</small>
                    <div>{portionLabels[portion]}</div>
                  </div>
                  <div className="col-6 text-end">
                    <small className="text-muted">Calories</small>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#4CAF50' }}>
                      {Math.round(selectedFood.calories * portionMultipliers[portion])}
                    </div>
                    <small className="text-muted">kcal</small>
                  </div>
                </div>

                <div className="row text-center border-top pt-3">
                  <div className="col-4">
                    <small className="text-muted d-block mb-1">Protein</small>
                    <strong>{Math.round(selectedFood.protein * portionMultipliers[portion])}g</strong>
                  </div>
                  <div className="col-4">
                    <small className="text-muted d-block mb-1">Carbs</small>
                    <strong>{Math.round(selectedFood.carbs * portionMultipliers[portion])}g</strong>
                  </div>
                  <div className="col-4">
                    <small className="text-muted d-block mb-1">Fat</small>
                    <strong>{Math.round(selectedFood.fat * portionMultipliers[portion])}g</strong>
                  </div>
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

            <button 
              className="btn btn-primary w-100 py-3 rounded-pill"
              onClick={handleConfirm}
            >
              Lưu món ăn
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

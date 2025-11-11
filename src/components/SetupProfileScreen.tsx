import React, { useState } from 'react';
import { ArrowLeft, User, Ruler, Weight, Activity } from 'lucide-react';
import { Screen, UserProfile } from '../App';

interface SetupProfileScreenProps {
  navigateTo: (screen: Screen) => void;
  userProfile: UserProfile;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
}

export function SetupProfileScreen({ navigateTo, userProfile, updateUserProfile }: SetupProfileScreenProps) {
  const [age, setAge] = useState(userProfile.age || 25);
  const [gender, setGender] = useState(userProfile.gender || 'male');
  const [height, setHeight] = useState(userProfile.height || 170);
  const [weight, setWeight] = useState(userProfile.weight || 65);
  const [activityLevel, setActivityLevel] = useState(userProfile.activityLevel || 'moderate');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({ age, gender, height, weight, activityLevel });
    navigateTo('goal-selection');
  };

  return (
    <div className="screen-container bg-light">
      <div className="screen-header">
        <button className="btn btn-link p-0 text-dark" onClick={() => navigateTo('signup')}>
          <ArrowLeft size={24} />
        </button>
        <h5 className="screen-title mb-0">Thiết lập hồ sơ</h5>
        <div style={{ width: '24px' }}></div>
      </div>

      <div className="p-4 fade-in">
        <div className="text-center mb-4 mt-3">
          <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex p-3 mb-3">
            <User size={40} className="text-primary" />
          </div>
          <h2>Thông tin cá nhân</h2>
          <p className="text-muted">Giúp chúng tôi hiểu rõ hơn về bạn</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="form-label d-flex align-items-center">
              <User size={18} className="me-2" />
              Giới tính
            </label>
            <div className="btn-group w-100" role="group">
              <input 
                type="radio" 
                className="btn-check" 
                name="gender" 
                id="male" 
                value="male"
                checked={gender === 'male'}
                onChange={(e) => setGender(e.target.value as any)}
              />
              <label className="btn btn-outline-primary" htmlFor="male">Nam</label>
              
              <input 
                type="radio" 
                className="btn-check" 
                name="gender" 
                id="female" 
                value="female"
                checked={gender === 'female'}
                onChange={(e) => setGender(e.target.value as any)}
              />
              <label className="btn btn-outline-primary" htmlFor="female">Nữ</label>
              
              <input 
                type="radio" 
                className="btn-check" 
                name="gender" 
                id="other" 
                value="other"
                checked={gender === 'other'}
                onChange={(e) => setGender(e.target.value as any)}
              />
              <label className="btn btn-outline-primary" htmlFor="other">Khác</label>
            </div>
          </div>

          <div className="form-floating mb-3">
            <input
              type="number"
              className="form-control"
              id="age"
              placeholder="Tuổi"
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              required
              min="10"
              max="100"
            />
            <label htmlFor="age">
              <User size={18} className="me-2" />
              Tuổi
            </label>
          </div>

          <div className="row g-3 mb-3">
            <div className="col-6">
              <div className="form-floating">
                <input
                  type="number"
                  className="form-control"
                  id="height"
                  placeholder="Chiều cao (cm)"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  required
                  min="100"
                  max="250"
                />
                <label htmlFor="height">
                  <Ruler size={18} className="me-2" />
                  Chiều cao (cm)
                </label>
              </div>
            </div>
            <div className="col-6">
              <div className="form-floating">
                <input
                  type="number"
                  className="form-control"
                  id="weight"
                  placeholder="Cân nặng (kg)"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  required
                  min="30"
                  max="200"
                  step="0.1"
                />
                <label htmlFor="weight">
                  <Weight size={18} className="me-2" />
                  Cân nặng (kg)
                </label>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label d-flex align-items-center">
              <Activity size={18} className="me-2" />
              Mức độ vận động
            </label>
            <select 
              className="form-select" 
              value={activityLevel}
              onChange={(e) => setActivityLevel(e.target.value as any)}
            >
              <option value="sedentary">Ít vận động (văn phòng)</option>
              <option value="light">Nhẹ (1-3 ngày/tuần)</option>
              <option value="moderate">Trung bình (3-5 ngày/tuần)</option>
              <option value="active">Tích cực (6-7 ngày/tuần)</option>
              <option value="very-active">Rất tích cực (thể thao chuyên nghiệp)</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary w-100 py-3 rounded-pill">
            Tiếp tục
          </button>
        </form>
      </div>
    </div>
  );
}

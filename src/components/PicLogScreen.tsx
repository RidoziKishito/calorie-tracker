import React, { useState } from 'react';
import { Calendar, Filter, Edit2, Trash2, Camera } from 'lucide-react';
import { Screen, FoodLog } from '../App';
import { BottomNav } from './BottomNav';

interface PicLogScreenProps {
  navigateTo: (screen: Screen) => void;
  foodLogs: FoodLog[];
  deleteFoodLog: (id: number) => void;
  updateFoodLog: (id: number, updates: Partial<FoodLog>) => void;
}

export function PicLogScreen({ navigateTo, foodLogs, deleteFoodLog, updateFoodLog }: PicLogScreenProps) {
  const [filterDate, setFilterDate] = useState('all');
  const [filterMeal, setFilterMeal] = useState('all');
  const [editingLog, setEditingLog] = useState<FoodLog | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Group logs by date
  const groupedLogs: { [key: string]: FoodLog[] } = {};
  
  let filteredLogs = [...foodLogs];
  
  if (filterDate !== 'all') {
    const today = new Date();
    if (filterDate === 'today') {
      filteredLogs = filteredLogs.filter(log => 
        new Date(log.timestamp).toDateString() === today.toDateString()
      );
    } else if (filterDate === 'week') {
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) >= weekAgo);
    }
  }
  
  if (filterMeal !== 'all') {
    filteredLogs = filteredLogs.filter(log => log.mealType === filterMeal);
  }

  filteredLogs.forEach(log => {
    const date = new Date(log.timestamp);
    const dateKey = date.toLocaleDateString('vi-VN', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    if (!groupedLogs[dateKey]) {
      groupedLogs[dateKey] = [];
    }
    groupedLogs[dateKey].push(log);
  });

  const handleDelete = (id: number) => {
    if (confirm('Bạn có chắc muốn xóa món ăn này?')) {
      deleteFoodLog(id);
    }
  };

  const handleEdit = (log: FoodLog) => {
    setEditingLog(log);
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (editingLog) {
      updateFoodLog(editingLog.id, {
        name: editingLog.name,
        calories: editingLog.calories,
        protein: editingLog.protein,
        carbs: editingLog.carbs,
        fat: editingLog.fat,
        portion: editingLog.portion,
        mealType: editingLog.mealType,
      });
      setShowEditModal(false);
      setEditingLog(null);
    }
  };

  const mealTypeLabels = {
    breakfast: 'Bữa sáng',
    lunch: 'Bữa trưa',
    dinner: 'Bữa tối',
    snack: 'Bữa phụ',
  };

  const totalCalories = filteredLogs.reduce((sum, log) => sum + log.calories, 0);

  return (
    <div className="screen-container bg-light">
      <div className="screen-header">
        <h5 className="screen-title mb-0">Nhật ký món ăn</h5>
        <button className="btn btn-link p-0 text-primary">
          <Filter size={24} />
        </button>
      </div>

      <div className="p-4 fade-in pb-5">
        {/* Filters */}
        <div className="row g-2 mb-4">
          <div className="col-6">
            <select 
              className="form-select"
              value={filterDate}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterDate(e.target.value)}
            >
              <option value="all">Tất cả ngày</option>
              <option value="today">Hôm nay</option>
              <option value="week">7 ngày qua</option>
            </select>
          </div>
          <div className="col-6">
            <select 
              className="form-select"
              value={filterMeal}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterMeal(e.target.value)}
            >
              <option value="all">Tất cả bữa</option>
              <option value="breakfast">Bữa sáng</option>
              <option value="lunch">Bữa trưa</option>
              <option value="dinner">Bữa tối</option>
              <option value="snack">Bữa phụ</option>
            </select>
          </div>
        </div>

        {/* Summary Card */}
        {filteredLogs.length > 0 && (
          <div className="card mb-4 border-0 shadow-sm">
            <div className="card-body">
              <div className="row text-center">
                <div className="col-4">
                  <small className="text-muted d-block mb-1">Tổng món</small>
                  <h5 className="mb-0">{filteredLogs.length}</h5>
                </div>
                <div className="col-4">
                  <small className="text-muted d-block mb-1">Tổng calories</small>
                  <h5 className="mb-0 text-primary">{totalCalories}</h5>
                </div>
                <div className="col-4">
                  <small className="text-muted d-block mb-1">Trung bình</small>
                  <h5 className="mb-0">{Math.round(totalCalories / filteredLogs.length)}</h5>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Logs Timeline */}
        {Object.keys(groupedLogs).length > 0 ? (
          Object.entries(groupedLogs).map(([date, logs]) => (
            <div key={date} className="mb-4">
              <div className="d-flex align-items-center mb-3">
                <Calendar size={18} className="text-muted me-2" />
                <h6 className="mb-0 text-muted">{date}</h6>
              </div>

              {logs.map((log) => (
                <div key={log.id} className="card mb-3 border-0 shadow-sm">
                  <div className="card-body">
                    <div className="d-flex">
                      {log.imageUrl && (
                        <div 
                          className="rounded me-3 flex-shrink-0"
                          style={{ 
                            width: '80px', 
                            height: '80px',
                            overflow: 'hidden'
                          }}
                        >
                          <img 
                            src={log.imageUrl} 
                            alt={log.name} 
                            style={{ 
                              width: '100%', 
                              height: '100%', 
                              objectFit: 'cover' 
                            }} 
                          />
                        </div>
                      )}
                      
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div>
                            <h6 className="mb-1">{log.name}</h6>
                            <span className="badge bg-primary bg-opacity-10 text-primary">
                              {mealTypeLabels[log.mealType]}
                            </span>
                          </div>
                          <div className="d-flex gap-2">
                            <button 
                              className="btn btn-sm btn-outline-primary p-1"
                              onClick={() => handleEdit(log)}
                            >
                              <Edit2 size={16} />
                            </button>
                            <button 
                              className="btn btn-sm btn-outline-danger p-1"
                              onClick={() => handleDelete(log.id)}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                        
                        <div className="mb-2">
                          <small className="text-muted">{log.portion}</small>
                        </div>
                        
                        <div className="d-flex justify-content-between">
                          <div>
                            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#4CAF50' }}>
                              {log.calories}
                            </div>
                            <small className="text-muted">kcal</small>
                          </div>
                          <div className="d-flex gap-3 small">
                            <div>
                              <div className="text-muted">P</div>
                              <div>{log.protein}g</div>
                            </div>
                            <div>
                              <div className="text-muted">C</div>
                              <div>{log.carbs}g</div>
                            </div>
                            <div>
                              <div className="text-muted">F</div>
                              <div>{log.fat}g</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))
        ) : (
          <div className="text-center py-5">
            <Camera size={64} className="text-muted mb-3 opacity-25" />
            <h5 className="text-muted mb-2">Chưa có nhật ký</h5>
            <p className="text-muted">Bắt đầu ghi nhận món ăn của bạn</p>
            <button 
              className="btn btn-primary mt-3 rounded-pill px-4"
              onClick={() => navigateTo('quick-log')}
            >
              Thêm món ăn
            </button>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && editingLog && (
        <div 
          className="modal d-block" 
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => setShowEditModal(false)}
        >
          <div 
            className="modal-dialog modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Chỉnh sửa món ăn</h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowEditModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    className="form-control"
                    value={editingLog.name}
                    onChange={(e) => setEditingLog({ ...editingLog, name: e.target.value })}
                  />
                  <label>Tên món ăn</label>
                </div>
                
                <div className="row g-2 mb-3">
                  <div className="col-6">
                    <div className="form-floating">
                      <input
                        type="number"
                        className="form-control"
                        value={editingLog.calories}
                        onChange={(e) => setEditingLog({ ...editingLog, calories: Number(e.target.value) })}
                      />
                      <label>Calories</label>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="form-floating">
                      <input
                        type="text"
                        className="form-control"
                        value={editingLog.portion}
                        onChange={(e) => setEditingLog({ ...editingLog, portion: e.target.value })}
                      />
                      <label>Khẩu phần</label>
                    </div>
                  </div>
                </div>

                <div className="row g-2 mb-3">
                  <div className="col-4">
                    <div className="form-floating">
                      <input
                        type="number"
                        className="form-control"
                        value={editingLog.protein}
                        onChange={(e) => setEditingLog({ ...editingLog, protein: Number(e.target.value) })}
                      />
                      <label>Protein (g)</label>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="form-floating">
                      <input
                        type="number"
                        className="form-control"
                        value={editingLog.carbs}
                        onChange={(e) => setEditingLog({ ...editingLog, carbs: Number(e.target.value) })}
                      />
                      <label>Carbs (g)</label>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="form-floating">
                      <input
                        type="number"
                        className="form-control"
                        value={editingLog.fat}
                        onChange={(e) => setEditingLog({ ...editingLog, fat: Number(e.target.value) })}
                      />
                      <label>Fat (g)</label>
                    </div>
                  </div>
                </div>

                <select 
                  className="form-select"
                  value={editingLog.mealType}
                  onChange={(e) => setEditingLog({ ...editingLog, mealType: e.target.value as any })}
                >
                  <option value="breakfast">Bữa sáng</option>
                  <option value="lunch">Bữa trưa</option>
                  <option value="dinner">Bữa tối</option>
                  <option value="snack">Bữa phụ</option>
                </select>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowEditModal(false)}
                >
                  Hủy
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={handleSaveEdit}
                >
                  Lưu thay đổi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <BottomNav currentScreen="pic-log" navigateTo={navigateTo} />
    </div>
  );
}

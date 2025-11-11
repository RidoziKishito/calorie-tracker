import React from 'react';
import { Home, Camera, Calendar, User } from 'lucide-react';
import { Screen } from '../App';

interface BottomNavProps {
  currentScreen: Screen;
  navigateTo: (screen: Screen) => void;
}

export function BottomNav({ currentScreen, navigateTo }: BottomNavProps) {
  const navItems = [
    { id: 'dashboard' as Screen, icon: Home, label: 'Trang chủ' },
    { id: 'pic-log' as Screen, icon: Camera, label: 'Nhật ký' },
    { id: 'meal-plan' as Screen, icon: Calendar, label: 'Thực đơn' },
    { id: 'profile' as Screen, icon: User, label: 'Cá nhân' },
  ];

  return (
    <div className="bottom-nav">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentScreen === item.id;
        
        return (
          <button
            key={item.id}
            className={`bottom-nav-item ${isActive ? 'active' : ''}`}
            onClick={() => navigateTo(item.id)}
          >
            <Icon size={22} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}

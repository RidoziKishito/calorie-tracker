import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { WelcomeScreen } from './components/WelcomeScreen';
import { LoginScreen } from './components/LoginScreen';
import { SignupScreen } from './components/SignupScreen';
import { SetupProfileScreen } from './components/SetupProfileScreen';
import { GoalSelectionScreen } from './components/GoalSelectionScreen';
import { DashboardScreen } from './components/DashboardScreen';
import { QuickLogScreen } from './components/QuickLogScreen';
import { ManualLogScreen } from './components/ManualLogScreen';
import { PicLogScreen } from './components/PicLogScreen';
import { MealPlanScreen } from './components/MealPlanScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { api } from './services/api';
import './App.css';

export type Screen = 
  | 'welcome'
  | 'login'
  | 'signup'
  | 'setup-profile'
  | 'goal-selection'
  | 'dashboard'
  | 'quick-log'
  | 'manual-log'
  | 'pic-log'
  | 'meal-plan'
  | 'profile'
  | 'settings';

export interface UserProfile {
  name: string;
  email: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  height?: number;
  weight?: number;
  activityLevel?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active';
  goal?: 'maintain' | 'lose' | 'gain';
  dailyCalories?: number;
}

export interface FoodLog {
  id: number; // unify with backend (serial primary key)
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  portion: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  timestamp: string; // ISO string from backend
  imageUrl?: string;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>(() => {
    // Check if user is authenticated
    return api.isAuthenticated() ? 'dashboard' : 'welcome';
  });
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: '',
    email: '',
  });
  const [foodLogs, setFoodLogs] = useState<FoodLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load user data on mount if authenticated
  useEffect(() => {
    if (api.isAuthenticated()) {
      loadUserData();
    }
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const [profile, logs] = await Promise.all([
        api.getProfile(),
        api.getFoodLogs()
      ]);
      setUserProfile(profile);
      setFoodLogs(logs as FoodLog[]);
      setError(null);
    } catch (err) {
      console.error('Error loading user data:', err);
      setError('Failed to load user data');
      // If unauthorized, redirect to login
      if (err instanceof Error && err.message.includes('Unauthorized')) {
        api.logout();
        setCurrentScreen('welcome');
      }
    } finally {
      setLoading(false);
    }
  };

  const navigateTo = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const addFoodLog = async (log: Omit<FoodLog, 'id' | 'timestamp'>) => {
    try {
      setLoading(true);
      const newLog = await api.addFoodLog(log);
      setFoodLogs([newLog as FoodLog, ...foodLogs]);
      setError(null);
    } catch (err) {
      console.error('Error adding food log:', err);
      setError('Failed to add food log');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    const updatedProfile = { ...userProfile, ...updates };
    try {
      setLoading(true);
      const result = await api.updateProfile(updates);
      setUserProfile(result);
      setError(null);
    } catch (err) {
      console.error('Error updating profile:', err);
      // Still update local state for demo purposes
      setUserProfile(updatedProfile);
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const deleteFoodLog = async (id: number) => {
    try {
      setLoading(true);
      await api.deleteFoodLog(id);
      setFoodLogs(foodLogs.filter((log: FoodLog) => log.id !== id));
      setError(null);
    } catch (err) {
      console.error('Error deleting food log:', err);
      setError('Failed to delete food log');
    } finally {
      setLoading(false);
    }
  };

  const updateFoodLog = async (id: number, updates: Partial<FoodLog>) => {
    try {
      setLoading(true);
      await api.updateFoodLog(id, updates);
      setFoodLogs(foodLogs.map((log: FoodLog) => log.id === id ? { ...log, ...updates } : log));
      setError(null);
    } catch (err) {
      console.error('Error updating food log:', err);
      setError('Failed to update food log');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      {/* Global status banners */}
      {loading && (
        <div className="alert alert-info text-center m-2 py-2" role="status">
          Đang xử lý...
        </div>
      )}
      {error && (
        <div className="alert alert-danger text-center m-2 py-2" role="alert">
          {error}
        </div>
      )}
      {currentScreen === 'welcome' && (
        <WelcomeScreen navigateTo={navigateTo} />
      )}
      {currentScreen === 'login' && (
        <LoginScreen navigateTo={navigateTo} updateUserProfile={updateUserProfile} />
      )}
      {currentScreen === 'signup' && (
        <SignupScreen navigateTo={navigateTo} updateUserProfile={updateUserProfile} />
      )}
      {currentScreen === 'setup-profile' && (
        <SetupProfileScreen 
          navigateTo={navigateTo} 
          userProfile={userProfile}
          updateUserProfile={updateUserProfile} 
        />
      )}
      {currentScreen === 'goal-selection' && (
        <GoalSelectionScreen 
          navigateTo={navigateTo} 
          userProfile={userProfile}
          updateUserProfile={updateUserProfile} 
        />
      )}
      {currentScreen === 'dashboard' && (
        <DashboardScreen 
          navigateTo={navigateTo}
          userProfile={userProfile}
          foodLogs={foodLogs}
        />
      )}
      {currentScreen === 'quick-log' && (
        <QuickLogScreen 
          navigateTo={navigateTo}
          addFoodLog={addFoodLog}
        />
      )}
      {currentScreen === 'manual-log' && (
        <ManualLogScreen 
          navigateTo={navigateTo}
          addFoodLog={addFoodLog}
        />
      )}
      {currentScreen === 'pic-log' && (
        <PicLogScreen 
          navigateTo={navigateTo}
          foodLogs={foodLogs}
          deleteFoodLog={deleteFoodLog}
          updateFoodLog={updateFoodLog}
        />
      )}
      {currentScreen === 'meal-plan' && (
        <MealPlanScreen 
          navigateTo={navigateTo}
          userProfile={userProfile}
        />
      )}
      {currentScreen === 'profile' && (
        <ProfileScreen 
          navigateTo={navigateTo}
          userProfile={userProfile}
          foodLogs={foodLogs}
        />
      )}
      {currentScreen === 'settings' && (
        <SettingsScreen 
          navigateTo={navigateTo}
        />
      )}
    </div>
  );
}

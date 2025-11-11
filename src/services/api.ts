// API Service for CalorieTracker
// This service handles all API calls to the FastAPI backend

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface UserProfile {
  email: string;
  name: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  height?: number;
  weight?: number;
  activityLevel?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active';
  goal?: 'maintain' | 'lose' | 'gain';
  dailyCalories?: number;
}

export interface FoodLog {
  id?: number;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  portion: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  timestamp?: string;
  imageUrl?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: UserProfile;
}

export interface FoodRecognitionResponse {
  food_name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  portion: string;
  confidence: number;
  message: string;
}

class ApiService {
  private token: string | null = null;

  constructor() {
    // Load token from localStorage on initialization
    this.token = localStorage.getItem('auth_token');
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  private setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  private clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_email');
  }

  // ============ Authentication ============
  async signup(name: string, email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Signup failed');
    }

    const data: AuthResponse = await response.json();
    this.setToken(data.access_token);
    localStorage.setItem('user_email', data.user.email);
    return data;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Login failed');
    }

    const data: AuthResponse = await response.json();
    this.setToken(data.access_token);
    localStorage.setItem('user_email', data.user.email);
    return data;
  }

  logout() {
    this.clearToken();
  }

  isAuthenticated(): boolean {
    return this.token !== null;
  }

  // ============ Profile ============
  async getProfile(): Promise<UserProfile> {
    const response = await fetch(`${API_BASE_URL}/api/profile`, {
      headers: this.getHeaders()
    });

    if (!response.ok) {
      if (response.status === 401) {
        this.clearToken();
        throw new Error('Unauthorized. Please login again.');
      }
      throw new Error('Failed to fetch profile');
    }

    return response.json();
  }

  async updateProfile(profile: Partial<UserProfile>): Promise<UserProfile> {
    const response = await fetch(`${API_BASE_URL}/api/profile`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(profile)
    });

    if (!response.ok) {
      throw new Error('Failed to update profile');
    }

    return response.json();
  }

  // ============ Food Logs ============
  async getFoodLogs(): Promise<FoodLog[]> {
    const response = await fetch(`${API_BASE_URL}/api/food/logs`, {
      headers: this.getHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch food logs');
    }

    return response.json();
  }

  async addFoodLog(log: Omit<FoodLog, 'id' | 'timestamp'>): Promise<FoodLog> {
    const response = await fetch(`${API_BASE_URL}/api/food/log`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(log)
    });

    if (!response.ok) {
      throw new Error('Failed to add food log');
    }

    return response.json();
  }

  async deleteFoodLog(logId: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/food/log/${logId}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to delete food log');
    }
  }

  async updateFoodLog(logId: number, updates: Partial<FoodLog>): Promise<FoodLog> {
    const response = await fetch(`${API_BASE_URL}/api/food/log/${logId}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(updates)
    });

    if (!response.ok) {
      throw new Error('Failed to update food log');
    }

    return response.json();
  }

  // ============ AI Features ============
  async analyzeFoodDescription(description: string): Promise<FoodRecognitionResponse> {
    const response = await fetch(`${API_BASE_URL}/api/ai/analyze-food`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ food_description: description })
    });

    if (!response.ok) {
      throw new Error('Failed to analyze food');
    }

    return response.json();
  }

  async analyzeFoodImage(imageFile: File): Promise<FoodRecognitionResponse> {
    const formData = new FormData();
    formData.append('image', imageFile);

    const headers: HeadersInit = {};
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_BASE_URL}/api/ai/analyze-food-image`, {
      method: 'POST',
      headers: headers,
      body: formData
    });

    if (!response.ok) {
      throw new Error('Failed to analyze food image');
    }

    return response.json();
  }

  // ============ Health Check ============
  async checkHealth(): Promise<{ status: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return response.json();
    } catch (error) {
      return { status: 'offline' };
    }
  }
}

// Export singleton instance
export const api = new ApiService();

// Export for testing
export default api;

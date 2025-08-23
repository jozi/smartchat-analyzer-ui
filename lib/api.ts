import axios from 'axios';
import { DashboardData, AnalysisResult, FilterType } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const ApiService = {
  async getDashboard(page: number = 1, limit: number = 25, filterType: FilterType = 'all'): Promise<DashboardData> {
    try {
      // Get JSON data from backend API
      const { data } = await api.get('/api/dashboard', {
        params: {
          page,
          limit_per_page: limit,
          filter_type: filterType,
        },
      });
      
      return data;
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      throw error;
    }
  },

  async fetchAndStoreChats(limit: number): Promise<void> {
    const formData = new FormData();
    formData.append('limit', limit.toString());
    
    await api.post('/fetch-and-store-chats', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  },

  async analyzeStoredChats(analysisLimit: number): Promise<void> {
    const formData = new FormData();
    formData.append('analysis_limit', analysisLimit.toString());
    
    await api.post('/analyze-stored-chats', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  },

  async resetAnalysis(): Promise<void> {
    await api.post('/reset-analysis');
  },

  async getConversation(storedChatId: number): Promise<any> {
    const { data } = await api.get(`/api/conversation/${storedChatId}`);
    return data;
  },

  async submitFeedback(resultId: number, feedback: 'confirm' | 'reject', reason?: string): Promise<void> {
    const formData = new FormData();
    formData.append('feedback', feedback);
    if (reason) {
      formData.append('reason', reason);
    }
    
    await api.post(`/submit-feedback/${resultId}`, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  },
};
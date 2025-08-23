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
    const { data } = await api.get('/', {
      params: {
        page,
        limit_per_page: limit,
        filter_type: filterType,
      },
    });
    
    // Parse HTML response to extract data (temporary until we have proper API)
    // In production, this should return JSON from backend
    return this.parseDashboardHTML(data);
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

  // Temporary function to parse HTML response
  // This should be replaced with proper JSON API
  parseDashboardHTML(html: string): DashboardData {
    // This is a placeholder - in production, backend should return JSON
    // For now, we'll return mock data
    return {
      stats: {
        wholesaleCount: 0,
        exportCount: 0,
        exitCount: 0,
        priceNegotiationCount: 0,
        combinedCount: 0,
        wholesalePercentage: 0,
        exportPercentage: 0,
        exitPercentage: 0,
        priceNegotiationPercentage: 0,
        combinedPercentage: 0,
        aiAccuracy: 0,
      },
      totalStoredChats: 0,
      unanalyzedChats: 0,
      results: [],
      currentPage: 1,
      totalPages: 1,
    };
  },
};
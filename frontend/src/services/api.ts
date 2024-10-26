import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const cardService = {
  searchCards: async (query: string) => {
    const response = await api.get(`/cards/search?q=${query}`);
    return response.data;
  },
  
  getCardDetails: async (id: string) => {
    const response = await api.get(`/cards/${id}`);
    return response.data;
  },
  
  getPriceHistory: async (id: string) => {
    const response = await api.get(`/cards/${id}/prices`);
    return response.data;
  }
};

export const userService = {
  getProfile: async () => {
    const response = await api.get('/user/profile');
    return response.data;
  },
  
  updatePreferences: async (preferences: any) => {
    const response = await api.put('/user/preferences', preferences);
    return response.data;
  }
};

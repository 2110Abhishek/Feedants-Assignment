import apiClient from './client';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const authApi = {
  login: async (email, password) => {
    const response = await apiClient.post('/auth/login', { email, password });
    if (response.data?.accessToken) {
      await AsyncStorage.setItem('@feedants_token', response.data.accessToken);
      await AsyncStorage.setItem('@feedants_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  register: async (userData) => {
    const response = await apiClient.post('/auth/register', userData);
    if (response.data?.accessToken) {
      await AsyncStorage.setItem('@feedants_token', response.data.accessToken);
      await AsyncStorage.setItem('@feedants_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  getMe: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data.user;
  },

  logout: async () => {
    await AsyncStorage.removeItem('@feedants_token');
    await AsyncStorage.removeItem('@feedants_user');
  },

  getStoredUser: async () => {
    const userStr = await AsyncStorage.getItem('@feedants_user');
    return userStr ? JSON.parse(userStr) : null;
  },
};

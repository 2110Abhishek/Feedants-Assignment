import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// For web and local emulator/device:
// On Android emulator, localhost is 10.0.2.2; on web or physical LAN it is localhost or IP.
// We provide smart detection with EXPO_PUBLIC_API_URL fallback.
const getDefaultBaseUrl = () => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5000/api/v1';
  }
  return 'http://127.0.0.1:5000/api/v1';
};

export const API_BASE_URL = getDefaultBaseUrl();

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('@feedants_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        delete config.headers.Authorization;
        delete config.headers['Authorization'];
      }
    } catch (err) {
      console.warn('Error reading auth token from storage:', err);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to format error objects
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorData = error.response?.data?.error || {
      code: 'NETWORK_ERROR',
      message: error.message || 'Unable to connect to server. Please check your connection.',
    };
    return Promise.reject(errorData);
  }
);

export default apiClient;

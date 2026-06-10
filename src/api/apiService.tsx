import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const apiClient = axios.create({
  baseURL: 'https://www.tatd.in/app-api/',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

apiClient.interceptors.response.use(
  response => response,
  error => {
    if (!error.response) {
      throw new Error('No internet connection. Please check your network.');
    }
    throw error;
  }
);

export const loginApi = (mobile: string) =>
  apiClient.post('driver/login/driver-login.php', {
    mobile,
    user_type: 'Driver',
    app_version: '2.37',
    app_type: 'android',
  });

export const verifyOtpApi = (mobile: string, otp: string) =>
  apiClient.post('driver/login/verify-otp-login.php', {
    mobile,
    otp,
    user_type: 'Driver',
    app_version: '2.37',
    app_type: 'android',
  });

export const switchLanguageApi = (current_language: 'english' | 'hindi') =>
  apiClient.post('driver/trusted-driver/switch-language-api.php', {
    action: 'update_language',
    current_language,
  });
import axios, { type AxiosRequestConfig } from 'axios';
import { API_CONFIG } from './config';

// Function to get telegram_id from localStorage or context
const getTelegramId = (): string | null => {
    // Try to get from localStorage first (set by TelegramUserProvider)
    const telegramId = localStorage.getItem('telegram_id');
    return telegramId;
};

const axiosInstance = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        // Add auth token if available
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Add telegram_id to headers if available
        const telegramId = getTelegramId();
        if (telegramId) {
            // config.headers['telegram_id'] = telegramId;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized access
            localStorage.removeItem('accessToken');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const customInstance = <T>(
    config: AxiosRequestConfig,
    options?: AxiosRequestConfig,
): Promise<T> => {
    return axiosInstance({
        ...config,
        ...options,
    }).then((response) => response.data);
};

export default axiosInstance;

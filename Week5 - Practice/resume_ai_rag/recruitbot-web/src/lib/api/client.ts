import axios, { AxiosInstance, AxiosError } from 'axios';
import toast from 'react-hot-toast';
import apiConfig from '@/config/api.config';

export const apiClient: AxiosInstance = axios.create({
  baseURL: apiConfig.baseUrl,
  timeout: apiConfig.timeout,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — add request ID
apiClient.interceptors.request.use(
  (config) => {
    config.headers['X-Request-ID'] = crypto.randomUUID();
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — surface errors via toast
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status;
      const message = (error.response.data as Record<string, unknown>)?.error as string || 'An error occurred';
      if (status === 404) toast.error(`Not found: ${message}`);
      else if (status === 500) toast.error('Server error. Please try again later.');
      else toast.error(message);
    } else if (error.request) {
      toast.error('Network error. Check your connection.');
    }
    return Promise.reject(error);
  }
);

export default apiClient;

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
const APP_NAME = import.meta.env.VITE_APP_NAME || 'RecruitBot';
const ENABLE_MOCK = import.meta.env.VITE_ENABLE_MOCK === 'true';

export const apiConfig = {
  baseUrl: API_BASE_URL,
  appName: APP_NAME,
  enableMock: ENABLE_MOCK,
  timeout: 30000,
};

export default apiConfig;

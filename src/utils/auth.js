import axios from 'axios';

export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');

  if (!refreshToken) {
    throw new Error('No refresh token');
  }

  const response = await axios.post(
    `${import.meta.env.VITE_APP_API_URL || 'http://localhost:8000'}/user/auth/refresh/`,
    { refresh: refreshToken }
  );

  const { access } = response.data;
  localStorage.setItem('accessToken', access);
  return access;
};

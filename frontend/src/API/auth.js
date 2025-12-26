import {axiosInstance} from './config';

export const authAPI = {
  login: (email, password) => {
    return axiosInstance.post('/auth/login', {
      email,
      password,
    });
  },

  register: (email, password, name, role) => {
    return axiosInstance.post('/auth/register', {
      email,
      password,
      name,
      role,
    });
  },

  logout: () => {
    const refreshToken = localStorage.getItem('refreshToken');
    return axiosInstance.post('/auth/logout', {refreshToken}).finally(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    });
  },

  refreshToken: (refreshToken) => {
    return axiosInstance.post('/auth/refresh-token', {refreshToken});
  },
};

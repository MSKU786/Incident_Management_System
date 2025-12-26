import {axiosInstance} from './config';

export const projectsAPI = {
  getAll: () => {
    return axiosInstance.get('/projects/');
  },

  getById: (id) => {
    return axiosInstance.get(`/projects/${id}`);
  },

  create: (name, location) => {
    return axiosInstance.post('/projects/', {
      name,
      location,
    });
  },

  update: (id, name, location) => {
    return axiosInstance.put(`/projects/${id}`, {
      name,
      location,
    });
  },

  delete: (id) => {
    return axiosInstance.delete(`/projects/${id}`);
  },
};

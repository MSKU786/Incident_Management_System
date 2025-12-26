import {axiosInstance} from './config';

export const incidentsAPI = {
  getAll: (filters) => {
    return axiosInstance.get('/incidents/', {
      params: filters,
    });
  },

  getById: (id) => {
    return axiosInstance.get(`/incidents/${id}`);
  },

  create: (data) => {
    return axiosInstance.post('/incidents/', data);
  },

  update: (id, data) => {
    return axiosInstance.put(`/incidents/${id}`, data);
  },

  delete: (id) => {
    return axiosInstance.delete(`/incidents/${id}`);
  },

  addAttachment: (incidentId, files) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('image', file);
    });
    return axiosInstance.post(`/incidents/${incidentId}/attachment`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

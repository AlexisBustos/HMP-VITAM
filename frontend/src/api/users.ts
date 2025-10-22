import apiClient from './client';

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: {
    id: number;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Role {
  id: number;
  name: string;
}

export const usersApi = {
  getAll: async () => {
    const response = await apiClient.get('/users');
    return response.data;
  },

  getById: async (id: number) => {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },

  updateRole: async (id: number, roleId: number) => {
    const response = await apiClient.patch(`/users/${id}/role`, { roleId });
    return response.data;
  },

  getRoles: async () => {
    const response = await apiClient.get('/users/roles');
    return response.data;
  }
};


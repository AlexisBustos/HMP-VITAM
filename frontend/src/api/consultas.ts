import apiClient from './client';

export interface Consulta {
  id?: number;
  pacienteId: number;
  motivo: string;
  cie10?: string;
  indicaciones?: string;
  medsIndicadas?: string;
  createdBy: number;
  createdAt?: string;
  paciente?: {
    id: number;
    rut: string;
    firstName: string;
    lastName: string;
  };
}

export const consultasApi = {
  getAll: async (pacienteId?: number) => {
    const params = pacienteId ? { pacienteId } : {};
    const response = await apiClient.get('/consultas', { params });
    return response.data;
  },

  getById: async (id: number) => {
    const response = await apiClient.get(`/consultas/${id}`);
    return response.data;
  },

  create: async (data: Omit<Consulta, 'id' | 'createdAt' | 'paciente'>) => {
    const response = await apiClient.post('/consultas', data);
    return response.data;
  }
};


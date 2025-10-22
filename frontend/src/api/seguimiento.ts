import apiClient from './client';

export type Patologia = 'HTA' | 'DM2' | 'DISLI' | 'OBESIDAD' | 'SALUD_MENTAL';

export interface Seguimiento {
  id?: number;
  pacienteId: number;
  patologia: Patologia;
  fecha: string;
  parametros?: string;
  adherencia?: string;
  notas?: string;
  proximoCtrl?: string;
  createdAt?: string;
  paciente?: {
    id: number;
    rut: string;
    firstName: string;
    lastName: string;
  };
}

export const seguimientoApi = {
  getAll: async (pacienteId?: number, patologia?: Patologia) => {
    const params: any = {};
    if (pacienteId) params.pacienteId = pacienteId;
    if (patologia) params.patologia = patologia;
    
    const response = await apiClient.get('/seguimiento', { params });
    return response.data;
  },

  getById: async (id: number) => {
    const response = await apiClient.get(`/seguimiento/${id}`);
    return response.data;
  },

  create: async (data: Omit<Seguimiento, 'id' | 'createdAt' | 'paciente'>) => {
    const response = await apiClient.post('/seguimiento', data);
    return response.data;
  },

  update: async (id: number, data: Partial<Seguimiento>) => {
    const response = await apiClient.put(`/seguimiento/${id}`, data);
    return response.data;
  }
};


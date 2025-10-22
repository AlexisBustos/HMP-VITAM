import apiClient from './client';

export interface Paciente {
  id?: number;
  rut: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  sex: 'M' | 'F' | 'Otro';
  genderId?: string;
  marital?: string;
  nationality?: string;
  address?: string;
  city?: string;
  region?: string;
  phone?: string;
  email?: string;
  education?: string;
  emergency?: string;
  chronic?: string;
  allergies?: string;
  surgeries?: string;
  meds?: string;
  familyHx?: string;
  habits?: string;
  anthropo?: string;
  vitals?: string;
  mental?: string;
  notes?: string;
  userId?: number;
}

export const pacientesApi = {
  getAll: async () => {
    const response = await apiClient.get('/pacientes');
    return response.data;
  },

  getById: async (id: number) => {
    const response = await apiClient.get(`/pacientes/${id}`);
    return response.data;
  },

  create: async (data: Paciente) => {
    const response = await apiClient.post('/pacientes', data);
    return response.data;
  },

  update: async (id: number, data: Partial<Paciente>) => {
    const response = await apiClient.put(`/pacientes/${id}`, data);
    return response.data;
  }
};


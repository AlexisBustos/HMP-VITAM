import apiClient from './client';

export interface Examen {
  id?: number;
  pacienteId: number;
  tipo: string;
  fecha: string;
  resultados?: string;
  referencia?: string;
  interpretacion?: 'normal' | 'alterado' | 'pendiente';
  pdfKey?: string;
  notas?: string;
  createdAt?: string;
  paciente?: {
    id: number;
    rut: string;
    firstName: string;
    lastName: string;
  };
}

export const examenesApi = {
  getAll: async (pacienteId?: number) => {
    const params = pacienteId ? { pacienteId } : {};
    const response = await apiClient.get('/examenes', { params });
    return response.data;
  },

  getById: async (id: number) => {
    const response = await apiClient.get(`/examenes/${id}`);
    return response.data;
  },

  create: async (data: Omit<Examen, 'id' | 'createdAt' | 'paciente'>) => {
    const response = await apiClient.post('/examenes', data);
    return response.data;
  },

  update: async (id: number, data: Partial<Examen>) => {
    const response = await apiClient.put(`/examenes/${id}`, data);
    return response.data;
  },

  uploadPdf: async (examenId: number, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('examenId', examenId.toString());
    
    const response = await apiClient.post('/uploads/examen-pdf', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  getPdfUrl: async (examenId: number) => {
    const response = await apiClient.get(`/uploads/examen-pdf/${examenId}`);
    return response.data;
  }
};


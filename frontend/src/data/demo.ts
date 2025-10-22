// Datos de demostración para la aplicación

export const demoMetrics = {
  pacientesActivos: 156,
  examenesAlterados: 23,
  controlesPendientes: 12
};

export const demoPacientes = [
  {
    id: 1,
    rut: '12.345.678-9',
    firstName: 'Juan',
    lastName: 'Pérez González',
    birthDate: '1980-05-15',
    sex: 'M',
    phone: '+56 9 1234 5678',
    email: 'juan.perez@email.com',
    city: 'Santiago',
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 2,
    rut: '23.456.789-0',
    firstName: 'María',
    lastName: 'González Silva',
    birthDate: '1975-08-22',
    sex: 'F',
    phone: '+56 9 8765 4321',
    email: 'maria.gonzalez@email.com',
    city: 'Valparaíso',
    createdAt: '2024-02-10T14:20:00Z'
  },
  {
    id: 3,
    rut: '34.567.890-1',
    firstName: 'Pedro',
    lastName: 'Martínez López',
    birthDate: '1990-12-03',
    sex: 'M',
    phone: '+56 9 5555 6666',
    email: 'pedro.martinez@email.com',
    city: 'Concepción',
    createdAt: '2024-03-05T09:15:00Z'
  },
  {
    id: 4,
    rut: '45.678.901-2',
    firstName: 'Ana',
    lastName: 'Rodríguez Muñoz',
    birthDate: '1985-03-18',
    sex: 'F',
    phone: '+56 9 7777 8888',
    email: 'ana.rodriguez@email.com',
    city: 'La Serena',
    createdAt: '2024-03-20T16:45:00Z'
  },
  {
    id: 5,
    rut: '56.789.012-3',
    firstName: 'Carlos',
    lastName: 'Fernández Torres',
    birthDate: '1978-11-30',
    sex: 'M',
    phone: '+56 9 9999 0000',
    email: 'carlos.fernandez@email.com',
    city: 'Temuco',
    createdAt: '2024-04-01T11:00:00Z'
  }
];

export const demoConsultas = [
  {
    id: 1,
    pacienteId: 1,
    paciente: demoPacientes[0],
    motivo: 'Control de hipertensión arterial. Paciente refiere cefalea ocasional.',
    cie10: 'I10',
    indicaciones: 'Continuar con tratamiento antihipertensivo. Control en 3 meses.',
    medsIndicadas: 'Enalapril 10mg (1 vez al día)',
    createdBy: 1,
    createdAt: '2024-10-15T10:30:00Z'
  },
  {
    id: 2,
    pacienteId: 2,
    paciente: demoPacientes[1],
    motivo: 'Dolor abdominal de 2 días de evolución, tipo cólico.',
    cie10: 'R10.4',
    indicaciones: 'Dieta blanda, reposo. Solicitar ecografía abdominal.',
    medsIndicadas: 'Omeprazol 20mg (1 vez al día), Buscapina (según dolor)',
    createdBy: 1,
    createdAt: '2024-10-18T14:20:00Z'
  }
];

export const demoExamenes = [
  {
    id: 1,
    pacienteId: 1,
    paciente: demoPacientes[0],
    tipo: 'Hemograma completo',
    fecha: '2024-10-10',
    resultados: '{"hemoglobina": "14.5 g/dL", "leucocitos": "7000/mm3", "plaquetas": "250000/mm3"}',
    referencia: 'Hb: 12-16 g/dL, Leucocitos: 4000-10000/mm3',
    interpretacion: 'normal',
    notas: 'Valores dentro de rangos normales',
    createdAt: '2024-10-10T09:00:00Z'
  },
  {
    id: 2,
    pacienteId: 2,
    paciente: demoPacientes[1],
    tipo: 'Perfil lipídico',
    fecha: '2024-10-12',
    resultados: '{"colesterol": "240 mg/dL", "HDL": "35 mg/dL", "LDL": "160 mg/dL", "trigliceridos": "180 mg/dL"}',
    referencia: 'Colesterol total: <200 mg/dL, LDL: <100 mg/dL',
    interpretacion: 'alterado',
    notas: 'Dislipidemia. Requiere tratamiento y cambios en estilo de vida.',
    createdAt: '2024-10-12T11:30:00Z'
  },
  {
    id: 3,
    pacienteId: 3,
    paciente: demoPacientes[2],
    tipo: 'Glicemia en ayunas',
    fecha: '2024-10-14',
    resultados: '{"glicemia": "95 mg/dL"}',
    referencia: '70-100 mg/dL',
    interpretacion: 'normal',
    createdAt: '2024-10-14T08:00:00Z'
  }
];

export const demoSeguimientos = [
  {
    id: 1,
    pacienteId: 1,
    paciente: demoPacientes[0],
    patologia: 'HTA',
    fecha: '2024-10-15',
    parametros: '{"pa": "130/85", "fc": "72 lpm", "peso": "78 kg"}',
    adherencia: '{"medicamentos": "buena", "dieta": "regular", "ejercicio": "mala"}',
    notas: 'Presión arterial controlada. Se recomienda aumentar actividad física.',
    proximoCtrl: '2025-01-15',
    createdAt: '2024-10-15T10:30:00Z'
  },
  {
    id: 2,
    pacienteId: 2,
    paciente: demoPacientes[1],
    patologia: 'DISLI',
    fecha: '2024-10-16',
    parametros: '{"colesterol": "240 mg/dL", "peso": "72 kg", "imc": "28.5"}',
    adherencia: '{"medicamentos": "regular", "dieta": "mala", "ejercicio": "mala"}',
    notas: 'Paciente con dificultad para adherir a cambios de estilo de vida. Se deriva a nutricionista.',
    proximoCtrl: '2024-12-16',
    createdAt: '2024-10-16T15:00:00Z'
  }
];


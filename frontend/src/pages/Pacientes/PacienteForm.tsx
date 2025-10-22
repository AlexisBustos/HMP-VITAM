import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Layout } from '../../components/layout/Layout';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { pacientesApi, Paciente } from '../../api/pacientes';

export const PacienteForm = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<Paciente>();

  const onSubmit = async (data: Paciente) => {
    try {
      setSubmitting(true);
      setError('');
      await pacientesApi.create(data);
      navigate('/pacientes');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al crear paciente');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="px-4 py-6 sm:px-0 max-w-4xl mx-auto">
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <Card title="Nuevo Paciente" subtitle="Complete la información del paciente">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Datos Personales */}
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-4">
                Datos Personales
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="RUT"
                  {...register('rut', { required: 'RUT es requerido' })}
                  error={errors.rut?.message}
                  placeholder="12.345.678-9"
                />
                
                <Input
                  label="Nombres"
                  {...register('firstName', { required: 'Nombres son requeridos' })}
                  error={errors.firstName?.message}
                />
                
                <Input
                  label="Apellidos"
                  {...register('lastName', { required: 'Apellidos son requeridos' })}
                  error={errors.lastName?.message}
                />
                
                <Input
                  label="Fecha de Nacimiento"
                  type="date"
                  {...register('birthDate', { required: 'Fecha de nacimiento es requerida' })}
                  error={errors.birthDate?.message}
                />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sexo <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register('sex', { required: 'Sexo es requerido' })}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Seleccione...</option>
                    <option value="M">Masculino</option>
                    <option value="F">Femenino</option>
                    <option value="Otro">Otro</option>
                  </select>
                  {errors.sex && (
                    <p className="mt-1 text-sm text-red-600">{errors.sex.message}</p>
                  )}
                </div>
                
                <Input
                  label="Identidad de Género"
                  {...register('genderId')}
                />
                
                <Input
                  label="Estado Civil"
                  {...register('marital')}
                />
                
                <Input
                  label="Nacionalidad"
                  {...register('nationality')}
                  placeholder="Chilena"
                />
                
                <Input
                  label="Nivel Educacional"
                  {...register('education')}
                />
              </div>
            </div>

            {/* Datos de Contacto */}
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-4">
                Datos de Contacto
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Teléfono"
                  {...register('phone')}
                  placeholder="+56 9 1234 5678"
                />
                
                <Input
                  label="Email"
                  type="email"
                  {...register('email')}
                />
                
                <Input
                  label="Dirección"
                  {...register('address')}
                  className="md:col-span-2"
                />
                
                <Input
                  label="Ciudad"
                  {...register('city')}
                />
                
                <Input
                  label="Región"
                  {...register('region')}
                />
                
                <Input
                  label="Contacto de Emergencia"
                  {...register('emergency')}
                  placeholder="Nombre y teléfono"
                  className="md:col-span-2"
                />
              </div>
            </div>

            {/* Ficha Médica */}
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-4">
                Ficha Médica
              </h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Enfermedades Crónicas
                  </label>
                  <textarea
                    {...register('chronic')}
                    rows={2}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Ej: Hipertensión, Diabetes tipo 2"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Alergias
                  </label>
                  <textarea
                    {...register('allergies')}
                    rows={2}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Ej: Penicilina, Polen"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cirugías Previas
                  </label>
                  <textarea
                    {...register('surgeries')}
                    rows={2}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Ej: Apendicectomía (2015)"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Medicamentos Actuales
                  </label>
                  <textarea
                    {...register('meds')}
                    rows={2}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Ej: Enalapril 10mg (1 vez al día)"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Antecedentes Familiares
                  </label>
                  <textarea
                    {...register('familyHx')}
                    rows={2}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Ej: Padre con diabetes, madre con hipertensión"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notas Adicionales
                  </label>
                  <textarea
                    {...register('notes')}
                    rows={3}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
            </div>

            {/* Botones */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/pacientes')}
              >
                Cancelar
              </Button>
              <Button type="submit" loading={submitting}>
                Guardar Paciente
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </Layout>
  );
};


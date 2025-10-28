import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout';
import { Card } from '../../components/common/Card';
import { Table } from '../../components/common/Table';
import { Button } from '../../components/common/Button';
import { demoPacientes } from '../../data/demo';

export const PacientesList = () => {
  const navigate = useNavigate();
  const [pacientes] = useState(demoPacientes);

  const columns = [
    {
      key: 'rut',
      header: 'RUT'
    },
    {
      key: 'firstName',
      header: 'Nombres'
    },
    {
      key: 'lastName',
      header: 'Apellidos'
    },
    {
      key: 'birthDate',
      header: 'Fecha Nacimiento',
      render: (item: any) => new Date(item.birthDate).toLocaleDateString('es-CL')
    },
    {
      key: 'city',
      header: 'Ciudad'
    },
    {
      key: 'phone',
      header: 'Teléfono'
    },
    {
      key: 'actions',
      header: 'Acciones',
      render: (item: any) => (
        <Button
          onClick={() => navigate(`/pacientes/${item.id}`)}
          variant="secondary"
        >
          Ver Ficha
        </Button>
      )
    }
  ];

  return (
    <Layout>
      <div className="px-4 py-6 sm:px-0">
        <Card
          title="Pacientes"
          subtitle="Listado de pacientes registrados (Datos de demostración)"
          headerAction={
            <Button onClick={() => navigate('/pacientes/nuevo')}>
              Nuevo Paciente
            </Button>
          }
        >
          <Table
            data={pacientes}
            columns={columns}
            emptyMessage="No hay pacientes registrados"
          />
        </Card>
      </div>
    </Layout>
  );
};


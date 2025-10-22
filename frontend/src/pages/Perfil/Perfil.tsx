import { Layout } from '../../components/layout/Layout';
import { Card } from '../../components/common/Card';
import { useAuthStore } from '../../store/auth';

export const Perfil = () => {
  const { user } = useAuthStore();

  if (!user) return null;

  const getRoleDescription = (roleName: string) => {
    const descriptions: Record<string, string> = {
      'ADMIN_GENERAL': 'Administrador General - Acceso completo al sistema',
      'ADMIN_PRO_CLINICO': 'Profesional Clínico - Gestión de pacientes y módulos clínicos',
      'PERSONA_NATURAL': 'Persona Natural - Acceso a información personal'
    };
    return descriptions[roleName] || roleName;
  };

  return (
    <Layout>
      <div className="px-4 py-6 sm:px-0 max-w-4xl mx-auto">
        <Card title="Mi Perfil" subtitle="Información de tu cuenta">
          <div className="space-y-6">
            {/* Información Personal */}
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-4">
                Información Personal
              </h4>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Nombres</dt>
                  <dd className="mt-1 text-sm text-gray-900">{user.firstName}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Apellidos</dt>
                  <dd className="mt-1 text-sm text-gray-900">{user.lastName}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">ID de Usuario</dt>
                  <dd className="mt-1 text-sm text-gray-900">#{user.id}</dd>
                </div>
              </dl>
            </div>

            {/* Rol y Permisos */}
            <div className="pt-6 border-t">
              <h4 className="text-md font-semibold text-gray-900 mb-4">
                Rol y Permisos
              </h4>
              <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-8 w-8 text-primary-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-primary-900">
                      {user.role}
                    </p>
                    <p className="text-sm text-primary-700">
                      {getRoleDescription(user.role)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Permisos Específicos */}
            <div className="pt-6 border-t">
              <h4 className="text-md font-semibold text-gray-900 mb-4">
                Permisos de Acceso
              </h4>
              <div className="space-y-2">
                {user.role === 'ADMIN_GENERAL' && (
                  <>
                    <PermissionItem
                      icon="✓"
                      text="Gestión de usuarios y roles"
                      granted
                    />
                    <PermissionItem
                      icon="✓"
                      text="Gestión completa de pacientes"
                      granted
                    />
                    <PermissionItem
                      icon="✓"
                      text="Acceso a todos los módulos clínicos"
                      granted
                    />
                    <PermissionItem
                      icon="✓"
                      text="Visualización de métricas y dashboard"
                      granted
                    />
                  </>
                )}
                
                {user.role === 'ADMIN_PRO_CLINICO' && (
                  <>
                    <PermissionItem
                      icon="✓"
                      text="Gestión completa de pacientes"
                      granted
                    />
                    <PermissionItem
                      icon="✓"
                      text="Registro de consultas médicas"
                      granted
                    />
                    <PermissionItem
                      icon="✓"
                      text="Gestión de exámenes y resultados"
                      granted
                    />
                    <PermissionItem
                      icon="✓"
                      text="Seguimiento de patologías crónicas"
                      granted
                    />
                    <PermissionItem
                      icon="✓"
                      text="Visualización de métricas y dashboard"
                      granted
                    />
                    <PermissionItem
                      icon="✗"
                      text="Gestión de usuarios"
                      granted={false}
                    />
                  </>
                )}
                
                {user.role === 'PERSONA_NATURAL' && (
                  <>
                    <PermissionItem
                      icon="✓"
                      text="Ver información personal"
                      granted
                    />
                    <PermissionItem
                      icon="✓"
                      text="Actualizar datos de contacto"
                      granted
                    />
                    <PermissionItem
                      icon="✗"
                      text="Acceso a módulos clínicos"
                      granted={false}
                    />
                    <PermissionItem
                      icon="✗"
                      text="Gestión de otros pacientes"
                      granted={false}
                    />
                  </>
                )}
              </div>
            </div>

            {/* Información del Sistema */}
            <div className="pt-6 border-t">
              <h4 className="text-md font-semibold text-gray-900 mb-4">
                Información del Sistema
              </h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-600">Versión del Sistema</dt>
                    <dd className="text-sm font-medium text-gray-900">1.0.0</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-600">Última Actualización</dt>
                    <dd className="text-sm font-medium text-gray-900">Octubre 2025</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-600">Soporte</dt>
                    <dd className="text-sm font-medium text-primary-600">
                      <a href="mailto:soporte@hmp.vitam.cl">soporte@hmp.vitam.cl</a>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

interface PermissionItemProps {
  icon: string;
  text: string;
  granted: boolean;
}

const PermissionItem: React.FC<PermissionItemProps> = ({ icon, text, granted }) => (
  <div className="flex items-center space-x-2">
    <span
      className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
        granted
          ? 'bg-green-100 text-green-700'
          : 'bg-red-100 text-red-700'
      }`}
    >
      {icon}
    </span>
    <span className={`text-sm ${granted ? 'text-gray-900' : 'text-gray-500'}`}>
      {text}
    </span>
  </div>
);


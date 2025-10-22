# Frontend - HMP Vitam Healthcare

Este es el frontend completo de la plataforma HMP Vitam Healthcare, construido con React, TypeScript y Tailwind CSS.

## 🎨 Características Implementadas

### Autenticación y Seguridad
- ✅ Sistema de login con validación
- ✅ Gestión de estado con Zustand (persistencia en localStorage)
- ✅ Guardas de ruta basadas en roles (RBAC)
- ✅ Interceptores de Axios para manejo automático de tokens
- ✅ Redirección automática en caso de token expirado

### Componentes Reutilizables
- ✅ **Button**: Botón con variantes (primary, secondary, danger, success) y estados de carga
- ✅ **Input**: Input con label, validación y mensajes de error
- ✅ **Card**: Tarjeta con título, subtítulo y acciones
- ✅ **Table**: Tabla genérica con tipado TypeScript
- ✅ **Modal**: Modal reutilizable con diferentes tamaños

### Páginas Principales

#### Dashboard
- Visualización de métricas clave (KPIs)
- Pacientes activos
- Porcentaje de exámenes alterados
- Controles pendientes
- Últimos pacientes registrados

#### Pacientes
- Listado de pacientes con búsqueda
- Formulario completo de registro
- Campos para datos personales, contacto y ficha médica
- Validación con React Hook Form

#### Consultas
- Listado de consultas médicas
- Modal para registrar nueva consulta
- Selección de paciente
- Campos: motivo, CIE-10, indicaciones, medicamentos

#### Exámenes
- Listado de exámenes de laboratorio
- Upload de archivos PDF a S3
- Descarga de PDFs con URLs firmadas
- Interpretación con badges de colores (normal/alterado/pendiente)

#### Seguimiento
- Control de patologías crónicas
- Patologías: HTA, DM2, Dislipidemia, Obesidad, Salud Mental
- Registro de parámetros y adherencia (formato JSON)
- Programación de próximo control

#### Perfil
- Información del usuario actual
- Descripción del rol y permisos
- Lista de permisos específicos según rol

### Layout y Navegación
- ✅ Barra de navegación responsive
- ✅ Menú adaptado según rol del usuario
- ✅ Información del usuario en header
- ✅ Botón de cerrar sesión

## 📦 Estructura de Archivos

```
frontend/
├── public/
├── src/
│   ├── api/                    # Servicios de API
│   │   ├── auth.ts
│   │   ├── client.ts          # Cliente Axios configurado
│   │   ├── consultas.ts
│   │   ├── dashboard.ts
│   │   ├── examenes.ts
│   │   ├── pacientes.ts
│   │   ├── seguimiento.ts
│   │   └── users.ts
│   ├── components/
│   │   ├── common/            # Componentes reutilizables
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── Table.tsx
│   │   └── layout/
│   │       └── Layout.tsx     # Layout principal
│   ├── pages/
│   │   ├── Auth/
│   │   │   └── Login.tsx
│   │   ├── Consultas/
│   │   │   └── ConsultasList.tsx
│   │   ├── Dashboard/
│   │   │   └── Dashboard.tsx
│   │   ├── Examenes/
│   │   │   └── ExamenesList.tsx
│   │   ├── Pacientes/
│   │   │   ├── PacienteForm.tsx
│   │   │   └── PacientesList.tsx
│   │   ├── Perfil/
│   │   │   └── Perfil.tsx
│   │   └── Seguimiento/
│   │       └── SeguimientoList.tsx
│   ├── routes/
│   │   └── ProtectedRoute.tsx # Guarda de rutas
│   ├── store/
│   │   └── auth.ts            # Store de autenticación (Zustand)
│   ├── App.tsx                # Configuración de rutas
│   ├── main.tsx               # Punto de entrada
│   └── index.css              # Estilos globales con Tailwind
├── .env.example
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## 🚀 Instalación y Uso

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env
```

Para desarrollo local, no es necesario modificar `.env` ya que Vite tiene un proxy configurado.

### 3. Iniciar servidor de desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

### 4. Construir para producción

```bash
npm run build
```

Los archivos compilados estarán en el directorio `dist/`

## 🎯 Rutas de la Aplicación

| Ruta                  | Componente         | Roles Permitidos                      |
|-----------------------|--------------------|---------------------------------------|
| `/login`              | Login              | Público                               |
| `/dashboard`          | Dashboard          | ADMIN_GENERAL, ADMIN_PRO_CLINICO      |
| `/pacientes`          | PacientesList      | Todos los autenticados                |
| `/pacientes/nuevo`    | PacienteForm       | ADMIN_GENERAL, ADMIN_PRO_CLINICO      |
| `/consultas`          | ConsultasList      | ADMIN_GENERAL, ADMIN_PRO_CLINICO      |
| `/examenes`           | ExamenesList       | ADMIN_GENERAL, ADMIN_PRO_CLINICO      |
| `/seguimiento`        | SeguimientoList    | ADMIN_GENERAL, ADMIN_PRO_CLINICO      |
| `/perfil`             | Perfil             | Todos los autenticados                |

## 🔐 Roles y Permisos

### ADMIN_GENERAL
- Acceso completo a todos los módulos
- Gestión de usuarios (registro, cambio de roles)
- Visualización de dashboard
- Gestión completa de pacientes y módulos clínicos

### ADMIN_PRO_CLINICO
- Gestión completa de pacientes
- Registro y consulta de módulos clínicos
- Visualización de dashboard
- Sin acceso a gestión de usuarios

### PERSONA_NATURAL
- Solo acceso a su propia información de paciente
- Visualización de perfil
- Sin acceso a módulos clínicos

## 🎨 Personalización de Estilos

El proyecto utiliza Tailwind CSS con una configuración personalizada:

- **Color primario**: Azul (`primary-*`)
- **Fuente**: System fonts (San Francisco, Segoe UI, etc.)
- **Responsive**: Mobile-first design

Para personalizar los colores, edite `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Personalice aquí
      }
    }
  }
}
```

## 📝 Validación de Formularios

Todos los formularios utilizan **React Hook Form** para validación:

```typescript
const { register, handleSubmit, formState: { errors } } = useForm<Type>();
```

Ejemplo de validación:

```typescript
<Input
  label="Email"
  {...register('email', { 
    required: 'Email es requerido',
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: 'Email inválido'
    }
  })}
  error={errors.email?.message}
/>
```

## 🔄 Gestión de Estado

El estado global se maneja con **Zustand**:

```typescript
// Usar el store
const { user, token, setAuth, logout } = useAuthStore();

// Verificar autenticación
const isAuthenticated = useAuthStore(state => state.isAuthenticated());

// Verificar roles
const hasRole = useAuthStore(state => state.hasRole('ADMIN_GENERAL'));
```

## 🌐 Llamadas a la API

Todas las llamadas a la API están centralizadas en el directorio `src/api/`:

```typescript
import { pacientesApi } from '../api/pacientes';

// Obtener todos los pacientes
const data = await pacientesApi.getAll();

// Crear un paciente
await pacientesApi.create(pacienteData);
```

El cliente de Axios (`client.ts`) maneja automáticamente:
- Inyección del token JWT en headers
- Redirección en caso de 401 (Unauthorized)
- Base URL desde variables de entorno

## 🧪 Próximos Pasos

- [ ] Agregar pruebas unitarias (Vitest + React Testing Library)
- [ ] Implementar paginación en tablas
- [ ] Agregar filtros y búsqueda avanzada
- [ ] Implementar notificaciones toast
- [ ] Agregar modo oscuro
- [ ] Optimizar performance con React.memo y useMemo
- [ ] Agregar skeleton loaders
- [ ] Implementar internacionalización (i18n)

## 📄 Licencia

Este proyecto es parte de HMP Vitam Healthcare.

---

**Desarrollado con**: React 18, TypeScript 5, Vite 5, Tailwind CSS 3


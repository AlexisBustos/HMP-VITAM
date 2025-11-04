# HMP VITAM - Sistema de Autenticación Completo

## Resumen de Implementación

Se ha implementado un sistema de autenticación completo con JWT, RBAC, gestión de sesiones y auditoría.

## Características Implementadas

### 1. Autenticación JWT
- Access tokens (15 minutos)
- Refresh tokens (7 días)
- Cookies httpOnly + Secure + SameSite
- Rotación automática de tokens

### 2. RBAC
- SUPER_ADMIN
- CLINICAL_ADMIN
- PERSON

### 3. Gestión de Sesiones
- Tracking de sesiones activas
- Revocación individual y masiva
- Información de IP y User-Agent

### 4. Seguridad de Contraseñas
- Hash con Argon2id
- Política estricta (10+ caracteres, mayúsculas, minúsculas, dígitos, especiales)
- Reset de contraseña con token

### 5. Auditoría
- Registro de eventos
- Tracking de acciones
- Metadata en JSON

## Archivos Creados

- /backend/src/utils/jwt.ts
- /backend/src/utils/password.ts
- /backend/src/utils/rut.ts
- /backend/src/modules/auth/auth.service.ts
- /backend/src/modules/auth/auth.controller.ts
- /backend/src/modules/auth/auth.validator.ts
- /backend/src/modules/auth/auth.routes.ts
- /backend/src/modules/common/auth.middleware.ts
- /backend/.env
- /backend/prisma/migrations/manual_add_auth_fields.sql

## Usuarios de Prueba

| Email | Password | Rol |
|-------|----------|-----|
| admin@vitam.cl | Admin123! | SUPER_ADMIN |
| clinadmin@vitam.cl | ClinAdmin123! | CLINICAL_ADMIN |
| persona@vitam.cl | Persona123! | PERSON |

## Endpoints Principales

- POST /api/auth/login
- POST /api/auth/register
- POST /api/auth/refresh
- POST /api/auth/logout
- POST /api/auth/forgot-password
- POST /api/auth/reset-password
- POST /api/auth/change-password
- GET /api/auth/me
- GET /api/auth/sessions
- DELETE /api/auth/sessions/:id

## Pasos para Desplegar

1. Actualizar base de datos RDS con migración SQL
2. Ejecutar seed para crear usuarios iniciales
3. Desplegar código en Elastic Beanstalk
4. Configurar variables de entorno
5. Verificar funcionamiento

Ver documentación completa en el archivo.

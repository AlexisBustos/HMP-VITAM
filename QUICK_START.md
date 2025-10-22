# Guía de Inicio Rápido - HMP Vitam Healthcare

Esta guía le ayudará a poner en marcha el proyecto en menos de 10 minutos.

## Requisitos Previos

- Node.js v20 o superior
- MySQL 8.0 o superior (local o en la nube)
- npm v9 o superior

## Paso 1: Clonar el Repositorio

```bash
git clone <repository-url>
cd hmp
```

## Paso 2: Configurar el Backend

### 2.1. Instalar dependencias

```bash
cd backend
npm install
```

### 2.2. Configurar variables de entorno

```bash
cp .env.example .env
```

Edite el archivo `.env` y configure:

- `DATABASE_URL`: URL de conexión a su base de datos MySQL
- `JWT_SECRET`: Una clave secreta aleatoria (mínimo 32 caracteres)
- Para desarrollo local, puede dejar las demás variables con sus valores por defecto

Ejemplo de `DATABASE_URL`:
```
DATABASE_URL="mysql://root:password@localhost:3306/hmp_db?connection_limit=20"
```

### 2.3. Crear la base de datos y aplicar migraciones

```bash
npx prisma migrate dev --name init
```

### 2.4. Poblar roles iniciales

```bash
npm run seed
```

### 2.5. Iniciar el servidor de desarrollo

```bash
npm run dev
```

El backend estará disponible en `http://localhost:8080`

## Paso 3: Configurar el Frontend

### 3.1. Abrir una nueva terminal e instalar dependencias

```bash
cd frontend
npm install
```

### 3.2. Configurar variables de entorno

```bash
cp .env.example .env
```

Para desarrollo local, no es necesario modificar el archivo `.env` ya que Vite tiene un proxy configurado.

### 3.3. Iniciar el servidor de desarrollo

```bash
npm run dev
```

El frontend estará disponible en `http://localhost:3000`

## Paso 4: Crear el Primer Usuario

Como el sistema requiere autenticación, necesitará crear un usuario administrador inicial. Puede hacerlo de dos formas:

### Opción A: Usando la API directamente (Postman/cURL)

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@hmp.vitam.cl",
    "password": "Admin123456",
    "firstName": "Admin",
    "lastName": "General",
    "roleId": 1
  }'
```

**Nota**: `roleId: 1` corresponde a `ADMIN_GENERAL`

### Opción B: Usando Swagger UI

1. Abra su navegador en `http://localhost:8080/api-docs`
2. Expanda el endpoint `POST /auth/register`
3. Haga clic en "Try it out"
4. Complete el JSON con los datos del usuario
5. Haga clic en "Execute"

## Paso 5: Iniciar Sesión

1. Abra su navegador en `http://localhost:3000`
2. Ingrese las credenciales del usuario que creó
3. Haga clic en "Iniciar Sesión"

¡Listo! Ahora puede comenzar a usar la plataforma.

## Roles Disponibles

| Role ID | Nombre               | Permisos                                                |
|---------|----------------------|---------------------------------------------------------|
| 1       | ADMIN_GENERAL        | Acceso completo a todos los módulos                     |
| 2       | ADMIN_PRO_CLINICO    | Gestión de pacientes y módulos clínicos                 |
| 3       | PERSONA_NATURAL      | Solo lectura de su propia información                   |

## Próximos Pasos

- Explore la documentación completa de la API en `http://localhost:8080/api-docs`
- Lea el archivo `README.md` para información detallada sobre arquitectura y despliegue
- Revise los archivos en `infra/` para configurar el despliegue en AWS

## Solución de Problemas

### Error de conexión a la base de datos

Verifique que:
- MySQL esté en ejecución
- Las credenciales en `DATABASE_URL` sean correctas
- La base de datos especificada exista

### Error "Cannot find module"

Ejecute `npm install` nuevamente en el directorio correspondiente.

### Puerto ya en uso

Si los puertos 8080 o 3000 están ocupados, puede cambiarlos:
- Backend: Modifique `PORT` en el archivo `.env`
- Frontend: Modifique el puerto en `vite.config.ts`

## Soporte

Para reportar problemas o solicitar ayuda, por favor abra un issue en el repositorio del proyecto.


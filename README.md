# HMP Vitam Healthcare - Plataforma de Gestión Médica

Este repositorio contiene el código fuente completo para la plataforma **HMP Vitam Healthcare**, una aplicación web full-stack diseñada para la gestión de historias clínicas electrónicas. La plataforma está construida con un stack moderno y está lista para ser desplegada en AWS.

## 1. Stack Tecnológico

La plataforma se divide en tres componentes principales: frontend, backend e infraestructura.

| Componente      | Tecnología                                                                        |
|-----------------|-----------------------------------------------------------------------------------|
| **Frontend**    | React, TypeScript, Vite, Tailwind CSS, React Router, Zustand, Axios, React Hook Form |
| **Backend**     | Node.js, Express, TypeScript, Prisma (MySQL), JWT, bcrypt, Zod, Swagger            |
| **Base de Datos** | MySQL (diseñado para AWS RDS)                                                     |
| **Storage**     | AWS S3 (para PDFs de exámenes y consentimientos)                                    |
| **Hosting**     | **FE**: AWS S3 + CloudFront (o Amplify) <br> **BE**: AWS EC2 (o Elastic Beanstalk) + Nginx |
| **CI/CD**       | GitHub Actions                                                                    |

## 2. Características Principales

- **Autenticación Segura**: Sistema de login basado en JSON Web Tokens (JWT) con hashing de contraseñas (bcrypt).
- **Control de Acceso Basado en Roles (RBAC)**: Tres roles predefinidos con distintos niveles de permisos:
    - `ADMIN_GENERAL`: Control total sobre usuarios, pacientes y todos los módulos clínicos.
    - `ADMIN_PRO_CLINICO`: Acceso a la gestión de pacientes y todos los módulos clínicos, pero no a la gestión de usuarios.
    - `PERSONA_NATURAL`: Acceso de solo lectura a su propia información de paciente y perfil.
- **Gestión de Pacientes**: CRUD completo para la información demográfica y de contacto de los pacientes.
- **Módulos Clínicos**: Funcionalidades para registrar y consultar:
    - **Consultas**: Atenciones médicas con motivo, diagnóstico (CIE-10) e indicaciones.
    - **Exámenes**: Carga de resultados de laboratorio y adjuntar PDFs a un bucket de S3.
    - **Seguimiento**: Controles de patologías crónicas (HTA, DM2, etc.).
- **Dashboard de Métricas**: Visualización de KPIs clave para administradores, como pacientes activos, exámenes alterados y controles pendientes.
- **API Documentada**: Endpoints de la API documentados con Swagger para facilitar la integración y el testing.
- **Infraestructura como Código (IaC)**: Archivos de configuración para Nginx, CORS de S3, políticas de IAM y Docker.
- **Despliegue Automatizado**: Workflows de GitHub Actions para la construcción del frontend y el despliegue del backend en EC2.

## 3. Estructura del Proyecto

El proyecto está organizado en un monorepo con tres directorios principales:

```
hmp/
├── backend/        # Aplicación Node.js/Express
│   ├── prisma/       # Schema y seed de la base de datos
│   ├── src/
│   │   ├── config/     # Conexión a DB
│   │   ├── modules/    # Lógica de negocio (auth, users, pacientes, etc.)
│   │   ├── app.ts      # Configuración de Express
│   │   └── server.ts   # Punto de entrada del servidor
│   ├── Dockerfile
│   └── swagger.json
├── frontend/       # Aplicación React/Vite
│   ├── public/
│   └── src/
│       ├── api/        # Clientes y servicios de API
│       ├── components/ # Componentes reutilizables
│       ├── pages/      # Vistas principales de la aplicación
│       ├── routes/     # Lógica de enrutamiento y guardas
│       └── store/      # Gestión de estado global (Zustand)
└── infra/          # Scripts y configuraciones de infraestructura
    ├── github-actions/ # Workflows de CI/CD
    ├── iam/            # Políticas de IAM
    ├── nginx/          # Configuración de reverse proxy
    └── s3/             # Configuración de CORS para S3
```

## 4. Instalación y Puesta en Marcha

### Prerrequisitos

- Node.js (v20+)
- npm (v9+)
- Docker y Docker Compose (opcional, para despliegue)
- Una instancia de base de datos MySQL (local o en la nube)

### 4.1. Backend

1.  **Navegar al directorio del backend**:
    ```bash
    cd backend
    ```

2.  **Instalar dependencias**:
    ```bash
    npm install
    ```

3.  **Configurar variables de entorno**:
    - Copie el archivo `.env.example` a `.env`.
    - Modifique el archivo `.env` con sus propias credenciales, especialmente `DATABASE_URL` y `JWT_SECRET`.
    ```bash
    cp .env.example .env
    # Edite el archivo .env
    ```

4.  **Aplicar migraciones y seed de la base de datos**:
    Este comando creará las tablas en la base de datos y poblará la tabla de roles.
    ```bash
    npx prisma migrate dev --name init
    npx prisma db seed
    ```

5.  **Iniciar el servidor de desarrollo**:
    ```bash
    npm run dev
    ```
    El servidor estará disponible en `http://localhost:8080`.

### 4.2. Frontend

1.  **Navegar al directorio del frontend** (en una nueva terminal):
    ```bash
    cd frontend
    ```

2.  **Instalar dependencias**:
    ```bash
    npm install
    ```

3.  **Configurar variables de entorno**:
    - Copie el archivo `.env.example` a `.env`.
    - Para desarrollo local, no es necesario modificar `VITE_API_URL` si el backend corre en el puerto 8080, ya que Vite está configurado con un proxy.
    ```bash
    cp .env.example .env
    ```

4.  **Iniciar el servidor de desarrollo**:
    ```bash
    npm run dev
    ```
    La aplicación estará disponible en `http://localhost:3000`.

## 5. Endpoints y Documentación de la API

Una vez que el servidor del backend esté en funcionamiento, la documentación completa de la API, generada con Swagger, estará disponible en:

**[http://localhost:8080/api-docs](http://localhost:8080/api-docs)**

## 6. Despliegue

El proyecto está diseñado para ser desplegado en AWS. Los pasos generales se describen en los archivos de GitHub Actions y la configuración de infraestructura.

-   **Backend**: Se despliega en una instancia EC2 con PM2 o Docker, detrás de un reverse proxy Nginx para manejar TLS.
-   **Frontend**: Se construye como una aplicación estática y se sube a un bucket de S3, distribuido globalmente a través de CloudFront.
-   **Base de Datos**: Se recomienda usar AWS RDS para una base de datos MySQL gestionada.
-   **CI/CD**: Los workflows en `infra/github-actions` automatizan la construcción y el despliegue al hacer `push` a la rama `main`.

### Scripts de Despliegue

-   `backend/Dockerfile`: Define la imagen de Docker para el backend.
-   `infra/github-actions/deploy-backend.yml`: Workflow para desplegar el backend en EC2 vía SSH.
-   `infra/github-actions/build-frontend.yml`: Workflow para construir el frontend y subir los artefactos.

## 7. Checklist de Seguridad

- **HTTPS Forzado**: Tanto en CloudFront como en Nginx.
- **Secrets Seguros**: `JWT_SECRET` y credenciales de AWS deben ser gestionados a través de un sistema como AWS Secrets Manager o variables de entorno en el servidor de producción (no hardcodeados).
- **CORS Restringido**: La configuración de CORS en el backend y en S3 solo permite orígenes del dominio de producción.
- **Encriptación en Reposo**: Habilitada en AWS S3 y AWS RDS.
- **Contraseñas Robustas**: Se utiliza `bcrypt` con un `saltRounds` de 12 para almacenar las contraseñas de forma segura.


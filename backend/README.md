# HMP Vitam - Backend API

Backend API para el sistema de gestión de salud HMP Vitam Healthcare.

## 🚀 Tecnologías

- **Node.js** + **Express** - Framework web
- **TypeScript** - Tipado estático
- **Prisma** - ORM para base de datos
- **PostgreSQL** - Base de datos (producción)
- **JWT** - Autenticación
- **Swagger** - Documentación API

---

## 📦 Instalación Local

```bash
# Instalar dependencias
npm install

# Generar Prisma Client
npx prisma generate

# Ejecutar migraciones
npx prisma migrate dev

# Seed de datos iniciales (opcional)
npm run seed

# Iniciar en modo desarrollo
npm run dev
```

---

## 🌐 Despliegue

### Railway (Recomendado)
Ver guía completa: [`DEPLOY_RAILWAY.md`](../DEPLOY_RAILWAY.md)

```bash
# 1. Conectar repo a Railway
# 2. Agregar PostgreSQL
# 3. Configurar variables de entorno
# 4. Deploy automático con cada push
```

---

## 🔧 Scripts Disponibles

```bash
npm run dev          # Desarrollo con hot-reload
npm run build        # Compilar TypeScript
npm start            # Iniciar servidor (producción)
npm run migrate      # Ejecutar migraciones
npm run seed         # Poblar base de datos
```

---

## 🔐 Variables de Entorno

Ver `.env.example` para la lista completa.

```bash
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
PORT=8080
NODE_ENV=production
CORS_ORIGIN=https://your-frontend.com
```

---

## 📚 API Documentation

Una vez iniciado el servidor:
- **Swagger UI**: `http://localhost:8080/api-docs`
- **Health Check**: `http://localhost:8080/health`

---

## 🗄️ Base de Datos

### Desarrollo (Local)
- SQLite (por defecto)
- Archivo: `prisma/dev.db`

### Producción (Railway)
- PostgreSQL managed
- Backups automáticos
- Conexión encriptada

---

## 🔄 Flujo de Trabajo

```bash
# 1. Hacer cambios
vim src/routes/patients.ts

# 2. Commit y push
git add .
git commit -m "feat: nuevo endpoint"
git push origin main

# 3. Railway despliega automáticamente ✨
```

---

## 📖 Estructura del Proyecto

```
backend/
├── src/
│   ├── routes/        # Rutas de la API
│   ├── controllers/   # Lógica de negocio
│   ├── middleware/    # Middleware (auth, etc)
│   ├── config/        # Configuración
│   ├── app.ts         # Configuración Express
│   └── server.ts      # Punto de entrada
├── prisma/
│   ├── schema.prisma  # Esquema de base de datos
│   ├── migrations/    # Migraciones
│   └── seed.ts        # Datos iniciales
├── railway.json       # Configuración Railway
├── Procfile           # Comando de inicio
└── package.json       # Dependencias
```

---

## 🧪 Testing

```bash
# Ejecutar tests (cuando estén implementados)
npm test

# Coverage
npm run test:coverage
```

---

## 🔗 Enlaces

- **Frontend**: https://github.com/AlexisBustos/HMP-VITAM/tree/main/frontend
- **Documentación**: Ver carpeta `/docs`
- **Railway**: https://railway.app

---

## 📄 Licencia

MIT


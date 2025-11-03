# Guía de Despliegue en Railway - HMP Vitam Backend

## 🚀 Despliegue Automático desde GitHub

### Paso 1: Crear Cuenta en Railway

1. **Ve a**: https://railway.app
2. **Clic en "Start a New Project"** o "Login"
3. **Inicia sesión con GitHub** (usa la misma cuenta de HMP-VITAM)
4. **Autoriza Railway** para acceder a tus repositorios

---

### Paso 2: Crear Proyecto y Base de Datos

#### 2.1 Crear Nuevo Proyecto
1. En el dashboard de Railway, clic en **"New Project"**
2. Selecciona **"Deploy from GitHub repo"**
3. Busca y selecciona **`AlexisBustos/HMP-VITAM`**
4. Railway detectará automáticamente tu backend

#### 2.2 Configurar Root Directory
1. En el proyecto, clic en tu servicio (backend)
2. Ve a **Settings** → **Source**
3. En **Root Directory**, escribe: `backend`
4. Guarda los cambios

#### 2.3 Agregar PostgreSQL
1. En el proyecto, clic en **"+ New"**
2. Selecciona **"Database"** → **"Add PostgreSQL"**
3. Railway creará una base de datos PostgreSQL automáticamente
4. La variable `DATABASE_URL` se generará automáticamente

---

### Paso 3: Configurar Variables de Entorno

1. En tu servicio (backend), ve a **"Variables"**
2. Agrega las siguientes variables:

```bash
# JWT (IMPORTANTE: Cambia este valor)
JWT_SECRET=tu_secreto_super_seguro_cambialo_ahora
JWT_EXPIRES_IN=7d

# Server
NODE_ENV=production
PORT=8080

# CORS (Actualiza con tu URL de Vercel)
CORS_ORIGIN=https://hmp-vitam.vercel.app

# DATABASE_URL se agrega automáticamente por Railway ✅
```

**Nota**: La variable `DATABASE_URL` se crea automáticamente cuando agregas PostgreSQL.

---

### Paso 4: Configurar Build y Deploy

Railway detectará automáticamente tu `railway.json` y ejecutará:

```bash
# Build
npm install
npx prisma generate
npm run build

# Deploy
npm run migrate  # Ejecuta migraciones de Prisma
npm start        # Inicia el servidor
```

---

### Paso 5: Desplegar

1. **Railway desplegará automáticamente** después de la configuración
2. **Espera 2-3 minutos** para el primer despliegue
3. **Verifica los logs** en la pestaña "Deployments"
4. **Obtén tu URL** en la pestaña "Settings" → "Domains"

---

## 🌐 Obtener URL Pública

### Opción 1: Dominio de Railway (Automático)
1. Ve a **Settings** → **Networking**
2. Clic en **"Generate Domain"**
3. Obtendrás algo como: `hmp-vitam-production.up.railway.app`

### Opción 2: Dominio Personalizado
1. Ve a **Settings** → **Networking**
2. Clic en **"Custom Domain"**
3. Agrega tu dominio (ej: `api.hmp-vitam.cl`)
4. Configura los DNS según las instrucciones

---

## 🔄 Flujo de Trabajo (Igual que Vercel)

```bash
# 1. Haces cambios en el backend
vim backend/src/routes/patients.ts

# 2. Commit y push a GitHub
git add .
git commit -m "feat: nuevo endpoint"
git push origin main

# 3. Railway detecta el push automáticamente ✨
# 4. Railway despliega automáticamente ✨
# 5. Recibes notificación cuando está listo ✨
```

---

## 🔗 Conectar Frontend con Backend

### En Vercel (Frontend):

1. Ve a tu proyecto en Vercel
2. **Settings** → **Environment Variables**
3. Agrega:

```bash
VITE_API_URL=https://hmp-vitam-production.up.railway.app
```

4. **Redeploy** el frontend

### En Railway (Backend):

1. Ve a **Variables**
2. Actualiza:

```bash
CORS_ORIGIN=https://hmp-vitam.vercel.app
```

---

## 📊 Arquitectura Final

```
┌─────────────────────────────────────────┐
│  Frontend (Vercel)                      │
│  https://hmp-vitam.vercel.app          │
└──────────────┬──────────────────────────┘
               │
               │ API Calls
               ↓
┌─────────────────────────────────────────┐
│  Backend (Railway)                      │
│  https://hmp-vitam-production.up...     │
└──────────────┬──────────────────────────┘
               │
               │ Prisma ORM
               ↓
┌─────────────────────────────────────────┐
│  PostgreSQL (Railway)                   │
│  Managed Database                       │
└─────────────────────────────────────────┘
```

---

## 🧪 Verificar Despliegue

### 1. Health Check
```bash
curl https://tu-backend.up.railway.app/health
```

Respuesta esperada:
```json
{
  "status": "ok",
  "timestamp": "2024-11-03T..."
}
```

### 2. API Documentation
Visita: `https://tu-backend.up.railway.app/api-docs`

### 3. Database Connection
Verifica en los logs de Railway:
```
✅ Database connected successfully
🚀 Server running on port 8080
```

---

## 🔧 Comandos Útiles

### Ver Logs en Tiempo Real
1. Ve a tu proyecto en Railway
2. Clic en tu servicio (backend)
3. Pestaña **"Deployments"**
4. Clic en el deployment activo
5. Los logs se actualizan en tiempo real

### Ejecutar Migraciones Manualmente
Si necesitas ejecutar migraciones:

1. Ve a **Settings** → **Variables**
2. Agrega temporalmente:
```bash
RAILWAY_RUN_COMMAND=npm run migrate
```
3. Redeploy
4. Elimina la variable después

### Seed de Datos
Para poblar la base de datos con datos iniciales:

1. Agrega script en `package.json`:
```json
"scripts": {
  "seed": "ts-node prisma/seed.ts"
}
```

2. Ejecuta desde Railway CLI o agrega al deploy:
```bash
npm run seed
```

---

## 🐛 Troubleshooting

### Error: "Database connection failed"
**Causa**: DATABASE_URL incorrecta o PostgreSQL no está corriendo

**Solución**:
1. Verifica que PostgreSQL esté agregado al proyecto
2. Verifica que `DATABASE_URL` esté en las variables
3. Reinicia el servicio

### Error: "Port already in use"
**Causa**: Variable PORT incorrecta

**Solución**:
1. Asegúrate de que `PORT=8080` en variables
2. Railway asignará el puerto automáticamente

### Error: "Prisma Client not generated"
**Causa**: `prisma generate` no se ejecutó en el build

**Solución**:
1. Verifica que `railway.json` tenga:
```json
"buildCommand": "npm install && npx prisma generate && npm run build"
```

### Error: "CORS policy blocked"
**Causa**: CORS_ORIGIN no coincide con el frontend

**Solución**:
1. Actualiza `CORS_ORIGIN` en Railway con la URL exacta de Vercel
2. No incluyas trailing slash: ✅ `https://app.com` ❌ `https://app.com/`

---

## 📈 Monitoreo

Railway proporciona métricas automáticas:

- **CPU Usage**: Uso de CPU en tiempo real
- **Memory Usage**: Uso de memoria
- **Network**: Tráfico de red
- **Requests**: Número de requests
- **Response Time**: Tiempo de respuesta promedio

Accede desde: **Metrics** en tu servicio

---

## 💰 Costos

### Plan Hobby (Desarrollo)
- **$5 de crédito gratis/mes**
- Suficiente para desarrollo y testing
- ~500 horas de uptime

### Plan Pro (Producción)
- **$20/mes**
- Recursos ilimitados
- Soporte prioritario
- Custom domains

---

## 🔐 Seguridad

### Variables de Entorno
- ✅ Nunca commitees `.env` a GitHub
- ✅ Usa variables de Railway para secretos
- ✅ Cambia `JWT_SECRET` en producción
- ✅ Usa contraseñas fuertes para database

### CORS
- ✅ Configura `CORS_ORIGIN` con tu dominio exacto
- ❌ No uses `*` en producción

### Database
- ✅ Railway encripta conexiones automáticamente
- ✅ Backups automáticos diarios
- ✅ Acceso restringido por defecto

---

## 📚 Recursos Adicionales

- **Railway Docs**: https://docs.railway.app
- **Prisma Docs**: https://www.prisma.io/docs
- **GitHub Repo**: https://github.com/AlexisBustos/HMP-VITAM

---

## ✅ Checklist Post-Despliegue

Después del despliegue, verifica:

- [ ] Backend responde en la URL de Railway
- [ ] Database está conectada (ver logs)
- [ ] Migraciones se ejecutaron correctamente
- [ ] API documentation accesible en `/api-docs`
- [ ] Health check responde OK
- [ ] Frontend puede hacer requests al backend
- [ ] CORS configurado correctamente
- [ ] Variables de entorno configuradas
- [ ] Logs no muestran errores

---

## 🎯 Próximos Pasos

1. ✅ Desplegar backend en Railway
2. ✅ Conectar frontend (Vercel) con backend (Railway)
3. ✅ Ejecutar seed de datos iniciales
4. ✅ Configurar dominio personalizado (opcional)
5. ✅ Configurar monitoring y alertas
6. ✅ Configurar backups automáticos

---

**¡Tu backend estará funcionando igual que Vercel!** 🚀

Cada `git push` desplegará automáticamente tanto frontend como backend.


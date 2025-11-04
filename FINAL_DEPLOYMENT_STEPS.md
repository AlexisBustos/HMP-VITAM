# Pasos Finales para Completar el Despliegue

## 📊 Estado Actual

### ✅ Completado

1. **Sistema de Autenticación Backend** - 100% funcional
   - JWT con access y refresh tokens
   - RBAC con 3 roles
   - Gestión de sesiones
   - Auditoría de eventos
   - Validación de RUT
   - 11 endpoints de autenticación

2. **Base de Datos**
   - Schema de Prisma actualizado con UUIDs
   - Migración SQL creada
   - Seed con usuarios de prueba

3. **Código**
   - Build exitoso localmente
   - Todos los cambios en GitHub
   - Documentación completa

4. **Configuración de Despliegue**
   - Post-deploy hooks configurados
   - .ebignore optimizado
   - Variables de entorno definidas

### ⚠️ Problema Actual

El despliegue en Elastic Beanstalk falla con:
```
ERROR   Instance deployment failed. For details, see 'eb-engine.log'.
ERROR   [Instance: i-055c5098c94c15de2] Command failed on instance.
```

---

## 🔍 Diagnóstico del Problema

### Paso 1: Revisar Logs de EB

Desde tu máquina local con EB CLI configurado:

```bash
cd ~/hmp-vitam-repo/backend
source ~/eb-venv/bin/activate
eb logs
```

Buscar en los logs:
- `/var/log/eb-engine.log` - Errores de despliegue
- `/var/log/nodejs/nodejs.log` - Errores de la aplicación
- `/var/log/eb-activity.log` - Actividad general

### Paso 2: Conectarse por SSH

```bash
eb ssh hmp-vitam-backend-prod
```

Una vez dentro:

```bash
# Ver logs en tiempo real
sudo tail -f /var/log/eb-engine.log
sudo tail -f /var/log/nodejs/nodejs.log

# Ver archivos desplegados
cd /var/app/current
ls -la

# Verificar build
ls -la dist/

# Verificar node_modules
ls -la node_modules/@prisma/

# Probar build manualmente
npm run build

# Probar Prisma
npx prisma generate
```

### Paso 3: Posibles Causas y Soluciones

#### Causa 1: Dependencias no instaladas

**Síntoma:** `Cannot find module '@prisma/client'`

**Solución:**
```bash
cd /var/app/current
npm install
npx prisma generate
```

#### Causa 2: Variables de entorno faltantes

**Síntoma:** `DATABASE_URL is not defined`

**Verificar:**
```bash
eb printenv
```

**Configurar si faltan:**
```bash
eb setenv \
  NODE_ENV=production \
  PORT=8080 \
  DATABASE_URL="postgresql://postgres:Alexis244143@hmp-vitam-db.cgbkgeo4gv71.us-east-1.rds.amazonaws.com:5432/hmp_vitam?schema=public" \
  JWT_ACCESS_SECRET="tu-secret-generado-64-chars" \
  JWT_REFRESH_SECRET="tu-secret-generado-64-chars" \
  ACCESS_TOKEN_TTL=15m \
  REFRESH_TOKEN_TTL=7d \
  CORS_ORIGIN="https://hmp-vitam-aws.vercel.app" \
  COOKIE_DOMAIN=".elasticbeanstalk.com"
```

#### Causa 3: Build falla en la instancia

**Síntoma:** `tsc: command not found` o errores de TypeScript

**Solución:** Verificar que `typescript` esté en `dependencies` (no `devDependencies`) o configurar build local:

```bash
# En tu máquina local
cd ~/hmp-vitam-repo/backend
npm run build

# Incluir dist/ en el despliegue
# Remover dist/ de .ebignore temporalmente
sed -i '/^dist\/$/d' .ebignore

# Redesplegar
eb deploy
```

#### Causa 4: Permisos de archivos

**Síntoma:** `Permission denied`

**Solución:**
```bash
cd /var/app/current
sudo chmod +x .platform/hooks/postdeploy/*.sh
sudo chown -R webapp:webapp .
```

#### Causa 5: Conexión a RDS bloqueada

**Síntoma:** `Can't reach database server`

**Verificar:**
1. Security Group de RDS permite conexiones desde el Security Group de EB
2. RDS está en la misma VPC que EB
3. DATABASE_URL es correcta

**Probar conexión:**
```bash
cd /var/app/current
npx prisma db push --skip-generate
```

---

## 🚀 Solución Alternativa: Despliegue Manual

Si el despliegue automático sigue fallando:

### Opción A: Build Local + Deploy

```bash
# En tu máquina local
cd ~/hmp-vitam-repo/backend

# Build localmente
npm install
npm run build

# Verificar que dist/ existe
ls -la dist/

# Modificar .ebignore para incluir dist/
echo "# Include dist for manual deployment" >> .ebignore
sed -i '/^dist\/$/d' .ebignore

# Modificar package.json para no hacer build en servidor
# Cambiar "build": "prisma generate && tsc"
# Por "build": "prisma generate"

# Redesplegar
eb deploy
```

### Opción B: Deploy vía ZIP

```bash
# Crear paquete limpio
cd ~/hmp-vitam-repo/backend
rm -rf node_modules dist
npm install
npm run build

# Crear ZIP
zip -r ../backend-deploy.zip . -x "node_modules/*" ".git/*" "*.log"

# Subir a S3
aws s3 cp ../backend-deploy.zip s3://elasticbeanstalk-us-east-1-<account-id>/

# Crear versión
aws elasticbeanstalk create-application-version \
  --application-name "HMP-Vitam" \
  --version-label "v1.0-manual" \
  --source-bundle S3Bucket="elasticbeanstalk-us-east-1-<account-id>",S3Key="backend-deploy.zip" \
  --region us-east-1

# Desplegar
aws elasticbeanstalk update-environment \
  --environment-name hmp-vitam-backend-prod \
  --version-label "v1.0-manual" \
  --region us-east-1
```

### Opción C: Configurar CodePipeline

1. Ir a AWS Console > CodePipeline
2. Crear nuevo pipeline
3. Source: GitHub (AlexisBustos/HMP-VITAM)
4. Build: AWS CodeBuild
5. Deploy: Elastic Beanstalk

**buildspec.yml:**
```yaml
version: 0.2

phases:
  install:
    runtime-versions:
      nodejs: 22
    commands:
      - cd backend
      - npm install
  
  build:
    commands:
      - npm run build
  
  post_build:
    commands:
      - echo Build completed

artifacts:
  files:
    - '**/*'
  base-directory: backend
```

---

## 🔧 Después del Despliegue Exitoso

### 1. Ejecutar Migración de Base de Datos

Si el post-deploy hook no funcionó:

```bash
eb ssh hmp-vitam-backend-prod

cd /var/app/current
npx prisma migrate deploy
# O usar el script SQL manual
psql -h hmp-vitam-db.cgbkgeo4gv71.us-east-1.rds.amazonaws.com \
     -U postgres \
     -d hmp_vitam \
     -f prisma/migrations/manual_add_auth_fields.sql
```

### 2. Ejecutar Seed

```bash
cd /var/app/current
npx prisma db seed
```

### 3. Verificar Health

```bash
curl https://hmp-vitam-backend-prod.eba-5c38q8kc.us-east-1.elasticbeanstalk.com/health
```

Respuesta esperada:
```json
{
  "status": "ok",
  "timestamp": "2025-11-04T12:00:00.000Z",
  "uptime": 123.45,
  "database": "connected"
}
```

### 4. Test Login

```bash
curl -X POST https://hmp-vitam-backend-prod.eba-5c38q8kc.us-east-1.elasticbeanstalk.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@vitam.cl",
    "password": "Admin123!"
  }' \
  -v
```

Debe retornar:
- Status 200
- Cookie `refreshToken`
- JSON con `accessToken` y datos del usuario

### 5. Test Endpoint Protegido

```bash
# Usar el accessToken del login anterior
curl -X GET https://hmp-vitam-backend-prod.eba-5c38q8kc.us-east-1.elasticbeanstalk.com/api/auth/me \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

---

## 📝 Checklist de Verificación

- [ ] Logs de EB revisados
- [ ] Causa del error identificada
- [ ] Solución aplicada
- [ ] Despliegue exitoso
- [ ] Migración de BD ejecutada
- [ ] Seed ejecutado
- [ ] Health endpoint responde
- [ ] Login funciona
- [ ] Endpoints protegidos requieren auth
- [ ] Refresh token funciona

---

## 🎯 Próximos Pasos (Después del Despliegue)

1. **Actualizar Módulos Restantes**
   - Ver `backend/TODO_UPDATE_MODULES.md`
   - Actualizar pacientes, consultas, exámenes, etc.
   - Descomentar rutas en `app.ts`

2. **Implementar Frontend de Autenticación**
   - AuthStore en Zustand
   - Login/Register forms
   - Axios interceptors
   - Route guards

3. **Testing**
   - Unit tests
   - Integration tests
   - E2E tests

4. **Monitoreo y Logs**
   - Configurar CloudWatch
   - Alertas de errores
   - Dashboard de métricas

---

## 📞 Información de Contacto

**URLs:**
- Backend: https://hmp-vitam-backend-prod.eba-5c38q8kc.us-east-1.elasticbeanstalk.com
- Frontend: https://hmp-vitam-aws.vercel.app
- RDS: hmp-vitam-db.cgbkgeo4gv71.us-east-1.rds.amazonaws.com:5432
- GitHub: https://github.com/AlexisBustos/HMP-VITAM

**Usuarios de Prueba:**
- admin@vitam.cl / Admin123! (SUPER_ADMIN)
- clinadmin@vitam.cl / ClinAdmin123! (CLINICAL_ADMIN)
- persona@vitam.cl / Persona123! (PERSON)

---

**Última actualización:** 4 de Noviembre, 2025 - 13:40 GMT-3


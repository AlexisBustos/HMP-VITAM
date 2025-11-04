# Guía de Despliegue - HMP VITAM Backend

## Estado Actual

✅ **Completado:**
- Sistema de autenticación implementado (JWT, RBAC, sesiones, auditoría)
- Código commiteado y pusheado a GitHub
- Build local exitoso
- Configuración de Elastic Beanstalk actualizada

⚠️ **Pendiente:**
- Despliegue en AWS Elastic Beanstalk (falló en primera instancia)
- Migración de base de datos RDS
- Seed de datos iniciales
- Pruebas de endpoints

---

## Problema del Despliegue

El despliegue falló con el siguiente error:
```
ERROR   Instance deployment failed. For details, see 'eb-engine.log'.
ERROR   [Instance: i-055c5098c94c15de2] Command failed on instance. Return code: 1
```

### Posibles Causas

1. **Dependencias faltantes** - Prisma CLI no instalado en producción
2. **Variables de entorno** - JWT secrets u otras variables no configuradas
3. **Migración de base de datos** - Prisma no puede conectarse o migrar
4. **Build fallido** - TypeScript o Prisma generate falló en la instancia

---

## Pasos para Diagnosticar y Resolver

### 1. Revisar Logs de Elastic Beanstalk

Desde tu máquina local con AWS CLI configurado:

```bash
# Activar entorno virtual de EB CLI
source ~/hmp-vitam-backend/eb-venv/bin/activate

# Ver logs recientes
cd ~/hmp-vitam-repo/backend
eb logs

# O usar AWS CLI
aws elasticbeanstalk describe-events \
  --application-name "HMP-Vitam" \
  --environment-name hmp-vitam-backend-prod \
  --max-items 50 \
  --region us-east-1
```

Buscar en los logs:
- `/var/log/eb-engine.log` - Errores de despliegue
- `/var/log/nodejs/nodejs.log` - Errores de la aplicación
- `/var/log/eb-activity.log` - Actividad general

### 2. Verificar Variables de Entorno

```bash
eb printenv
```

Asegurarse de que estén configuradas:
- `DATABASE_URL`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `NODE_ENV=production`
- `CORS_ORIGIN`

Si faltan, configurarlas:
```bash
eb setenv \
  NODE_ENV=production \
  PORT=8080 \
  DATABASE_URL="postgresql://postgres:Alexis244143@hmp-vitam-db.cgbkgeo4gv71.us-east-1.rds.amazonaws.com:5432/hmp_vitam?schema=public" \
  JWT_ACCESS_SECRET="<tu-secret-64-chars>" \
  JWT_REFRESH_SECRET="<tu-secret-64-chars>" \
  ACCESS_TOKEN_TTL=15m \
  REFRESH_TOKEN_TTL=7d \
  CORS_ORIGIN="https://hmp-vitam-aws.vercel.app" \
  COOKIE_DOMAIN=".elasticbeanstalk.com"
```

### 3. Verificar package.json

Asegurarse de que tenga los scripts correctos:

```json
{
  "scripts": {
    "build": "prisma generate && tsc",
    "start": "node dist/index.js",
    "postinstall": "prisma generate"
  }
}
```

### 4. Conectarse por SSH a la Instancia

```bash
eb ssh hmp-vitam-backend-prod
```

Una vez dentro:
```bash
# Ver logs de la aplicación
sudo tail -f /var/log/nodejs/nodejs.log

# Ver logs de despliegue
sudo tail -f /var/log/eb-engine.log

# Verificar archivos
cd /var/app/current
ls -la

# Verificar build
ls -la dist/

# Probar Prisma manualmente
npx prisma generate
npx prisma migrate deploy
```

### 5. Ejecutar Migración de Base de Datos

Si Prisma no puede migrar automáticamente, hacerlo manualmente:

**Opción A: Desde la instancia EC2**
```bash
eb ssh hmp-vitam-backend-prod
cd /var/app/current
npx prisma migrate deploy
npx prisma db seed
```

**Opción B: Desde tu máquina con acceso a RDS**
```bash
cd ~/hmp-vitam-repo/backend

# Ejecutar migración SQL manual
psql -h hmp-vitam-db.cgbkgeo4gv71.us-east-1.rds.amazonaws.com \
     -U postgres \
     -d hmp_vitam \
     -f prisma/migrations/manual_add_auth_fields.sql

# O usar Prisma
npx prisma migrate deploy

# Ejecutar seed
npx prisma db seed
```

### 6. Verificar .ebignore

Crear o actualizar `.ebignore` para excluir archivos innecesarios:

```
node_modules/
.git/
.env
*.log
.DS_Store
coverage/
.vscode/
.idea/
```

### 7. Intentar Redespliegue

```bash
cd ~/hmp-vitam-repo/backend
eb deploy hmp-vitam-backend-prod
```

---

## Alternativa: Despliegue Manual Paso a Paso

Si el despliegue automático sigue fallando:

### 1. Crear un paquete limpio

```bash
cd ~/hmp-vitam-repo/backend

# Limpiar y reconstruir
rm -rf node_modules dist
npm install
npm run build

# Crear archivo ZIP
zip -r backend-deploy.zip . -x "node_modules/*" ".git/*" "*.log"
```

### 2. Subir manualmente a S3

```bash
aws s3 cp backend-deploy.zip s3://elasticbeanstalk-us-east-1-<account-id>/
```

### 3. Crear versión de aplicación

```bash
aws elasticbeanstalk create-application-version \
  --application-name "HMP-Vitam" \
  --version-label "v1.0-auth-system" \
  --source-bundle S3Bucket="elasticbeanstalk-us-east-1-<account-id>",S3Key="backend-deploy.zip" \
  --region us-east-1
```

### 4. Actualizar entorno

```bash
aws elasticbeanstalk update-environment \
  --environment-name hmp-vitam-backend-prod \
  --version-label "v1.0-auth-system" \
  --region us-east-1
```

---

## Verificación Post-Despliegue

Una vez que el despliegue sea exitoso:

### 1. Health Check

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

### 2. Test Login

```bash
curl -X POST https://hmp-vitam-backend-prod.eba-5c38q8kc.us-east-1.elasticbeanstalk.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@vitam.cl","password":"Admin123!"}' \
  -c cookies.txt \
  -v
```

Debe retornar:
- Status 200
- Cookie `refreshToken`
- JSON con `accessToken` y datos del usuario

### 3. Test Protected Endpoint

```bash
# Extraer access token del response anterior
ACCESS_TOKEN="<token-aqui>"

curl -X GET https://hmp-vitam-backend-prod.eba-5c38q8kc.us-east-1.elasticbeanstalk.com/api/auth/me \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

### 4. Test Refresh Token

```bash
curl -X POST https://hmp-vitam-backend-prod.eba-5c38q8kc.us-east-1.elasticbeanstalk.com/api/auth/refresh \
  -b cookies.txt
```

---

## Checklist de Verificación

- [ ] Logs de EB revisados y sin errores críticos
- [ ] Variables de entorno configuradas correctamente
- [ ] Base de datos RDS accesible desde la instancia
- [ ] Migración de Prisma ejecutada exitosamente
- [ ] Seed de datos completado
- [ ] Health endpoint responde correctamente
- [ ] Login funciona y retorna tokens
- [ ] Endpoints protegidos requieren autenticación
- [ ] Refresh token funciona correctamente
- [ ] CORS configurado para el frontend

---

## Contacto y Soporte

Si necesitas ayuda adicional:
1. Revisar logs detallados en AWS Console
2. Verificar Security Groups y acceso a RDS
3. Confirmar que la instancia EC2 tiene acceso a internet
4. Verificar IAM roles y permisos

**URLs del Sistema:**
- Backend: https://hmp-vitam-backend-prod.eba-5c38q8kc.us-east-1.elasticbeanstalk.com
- Frontend: https://hmp-vitam-aws.vercel.app
- RDS: hmp-vitam-db.cgbkgeo4gv71.us-east-1.rds.amazonaws.com:5432

---

**Última actualización:** 4 de Noviembre, 2025


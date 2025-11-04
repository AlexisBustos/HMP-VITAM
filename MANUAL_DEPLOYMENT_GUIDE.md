# Guía Paso a Paso: Despliegue Manual de HMP VITAM

Esta guía te llevará paso por paso para completar el despliegue del sistema de autenticación en AWS Elastic Beanstalk.

---

## 📋 Pre-requisitos

Antes de comenzar, asegúrate de tener:

- [ ] Acceso a tu máquina local con el repositorio clonado
- [ ] AWS CLI configurado
- [ ] EB CLI instalado y configurado
- [ ] Acceso a la consola de AWS
- [ ] Credenciales de la base de datos RDS

---

## 🔍 PASO 1: Diagnosticar el Problema Actual

### 1.1. Clonar/Actualizar el Repositorio

```bash
# Si no lo tienes clonado
cd ~
git clone https://github.com/AlexisBustos/HMP-VITAM.git hmp-vitam-repo

# Si ya lo tienes, actualizar
cd ~/hmp-vitam-repo
git pull origin main
```

### 1.2. Activar EB CLI

```bash
cd ~/hmp-vitam-repo/backend

# Activar entorno virtual de EB
source ~/eb-venv/bin/activate

# Verificar que EB CLI funciona
eb --version
```

Deberías ver algo como: `EB CLI 3.x.x`

### 1.3. Ver los Logs del Error

```bash
# Ver logs recientes
eb logs

# Guardar logs en un archivo
eb logs > ~/eb-logs-$(date +%Y%m%d-%H%M%S).txt
```

**Buscar en los logs:**
- Líneas con `ERROR` o `error`
- Mensajes sobre dependencias faltantes
- Errores de conexión a base de datos
- Problemas de build o compilación

### 1.4. Identificar el Problema

Los errores más comunes son:

**A. Dependencias no instaladas:**
```
Cannot find module '@prisma/client'
Cannot find module 'argon2'
```

**B. Build fallido:**
```
tsc: command not found
prisma: command not found
```

**C. Variables de entorno faltantes:**
```
DATABASE_URL is not defined
JWT_ACCESS_SECRET is not defined
```

**D. Conexión a RDS bloqueada:**
```
Can't reach database server
Connection timeout
```

---

## 🔧 PASO 2: Solucionar el Problema Identificado

### Solución A: Si faltan dependencias

#### 2A.1. Conectarse por SSH a la instancia

```bash
eb ssh hmp-vitam-backend-prod
```

#### 2A.2. Navegar al directorio de la aplicación

```bash
cd /var/app/current
ls -la
```

Deberías ver archivos como `package.json`, `prisma/`, `src/`, etc.

#### 2A.3. Instalar dependencias manualmente

```bash
# Instalar dependencias
sudo npm install

# Generar Prisma Client
sudo npx prisma generate

# Verificar que se instaló correctamente
ls -la node_modules/@prisma/client
```

#### 2A.4. Reiniciar la aplicación

```bash
# Salir de SSH
exit

# Reiniciar el entorno desde tu máquina local
eb restart hmp-vitam-backend-prod
```

### Solución B: Si el build falla

#### 2B.1. Build local y deploy con dist/

En tu máquina local:

```bash
cd ~/hmp-vitam-repo/backend

# Limpiar build anterior
rm -rf dist node_modules

# Instalar dependencias
npm install

# Build local
npm run build

# Verificar que dist/ existe y tiene contenido
ls -la dist/
```

#### 2B.2. Modificar .ebignore para incluir dist/

```bash
# Hacer backup
cp .ebignore .ebignore.backup

# Remover dist/ de .ebignore
sed -i '/^dist\/$/d' .ebignore

# Verificar
cat .ebignore
```

#### 2B.3. Modificar package.json para no hacer build en servidor

```bash
# Editar package.json
nano package.json
```

Cambiar:
```json
"scripts": {
  "build": "prisma generate && tsc",
  "start": "node dist/server.js"
}
```

Por:
```json
"scripts": {
  "build": "prisma generate",
  "start": "node dist/server.js"
}
```

Guardar con `Ctrl+O`, Enter, `Ctrl+X`

#### 2B.4. Commit y redeploy

```bash
git add .ebignore package.json dist/
git commit -m "fix: Include built dist in deployment"
git push origin main

# Redesplegar
eb deploy hmp-vitam-backend-prod
```

### Solución C: Si faltan variables de entorno

#### 2C.1. Ver variables actuales

```bash
eb printenv
```

#### 2C.2. Configurar variables faltantes

Primero, obtén los secrets del archivo .env local:

```bash
cd ~/hmp-vitam-repo/backend
cat .env | grep JWT
```

Copia los valores de `JWT_ACCESS_SECRET` y `JWT_REFRESH_SECRET`

Luego configura todas las variables:

```bash
eb setenv \
  NODE_ENV=production \
  PORT=8080 \
  DATABASE_URL="postgresql://postgres:Alexis244143@hmp-vitam-db.cgbkgeo4gv71.us-east-1.rds.amazonaws.com:5432/hmp_vitam?schema=public" \
  JWT_ACCESS_SECRET="<pegar-valor-aqui>" \
  JWT_REFRESH_SECRET="<pegar-valor-aqui>" \
  ACCESS_TOKEN_TTL=15m \
  REFRESH_TOKEN_TTL=7d \
  CORS_ORIGIN="https://hmp-vitam-aws.vercel.app" \
  COOKIE_DOMAIN=".elasticbeanstalk.com"
```

**Nota:** Reemplaza `<pegar-valor-aqui>` con los valores reales de tu `.env`

#### 2C.3. Verificar que se configuraron

```bash
eb printenv | grep JWT
eb printenv | grep DATABASE
```

#### 2C.4. Reiniciar

```bash
eb restart hmp-vitam-backend-prod
```

### Solución D: Si RDS está bloqueado

#### 2D.1. Verificar Security Groups

En AWS Console:

1. Ve a **EC2 > Security Groups**
2. Busca el Security Group de tu instancia EB (algo como `sg-xxxxx`)
3. Busca el Security Group de RDS (algo como `sg-yyyyy`)

#### 2D.2. Agregar regla en RDS Security Group

En el Security Group de RDS:

1. Click en **Inbound rules**
2. Click en **Edit inbound rules**
3. Click en **Add rule**
4. Configurar:
   - **Type:** PostgreSQL
   - **Protocol:** TCP
   - **Port:** 5432
   - **Source:** Custom > [Security Group de EB]
   - **Description:** Allow from EB instance
5. Click en **Save rules**

#### 2D.3. Verificar conexión desde EB

```bash
eb ssh hmp-vitam-backend-prod

# Probar conexión a RDS
nc -zv hmp-vitam-db.cgbkgeo4gv71.us-east-1.rds.amazonaws.com 5432
```

Deberías ver: `Connection to ... 5432 port [tcp/postgresql] succeeded!`

---

## ✅ PASO 3: Verificar que el Despliegue Funcionó

### 3.1. Verificar estado del entorno

```bash
eb status
```

Deberías ver:
```
Environment details for: hmp-vitam-backend-prod
  Application name: HMP-Vitam
  ...
  Status: Ready
  Health: Green
```

### 3.2. Probar Health Endpoint

```bash
curl https://hmp-vitam-backend-prod.eba-5c38q8kc.us-east-1.elasticbeanstalk.com/health
```

**Respuesta esperada:**
```json
{
  "status": "ok",
  "timestamp": "2025-11-04T...",
  "uptime": 123.45,
  "database": "connected"
}
```

Si ves `"database": "error"`, ve al Paso 4 para ejecutar la migración.

### 3.3. Ver logs de la aplicación

```bash
eb ssh hmp-vitam-backend-prod
sudo tail -f /var/log/nodejs/nodejs.log
```

Deberías ver:
```
Server running on port 8080
Database connected successfully
```

---

## 🗄️ PASO 4: Ejecutar Migración de Base de Datos

### Opción A: Desde la instancia EB (Recomendado)

#### 4A.1. Conectarse por SSH

```bash
eb ssh hmp-vitam-backend-prod
```

#### 4A.2. Navegar al directorio

```bash
cd /var/app/current
```

#### 4A.3. Ejecutar migración

```bash
# Verificar que DATABASE_URL está configurada
echo $DATABASE_URL

# Ejecutar migración
sudo npx prisma migrate deploy
```

**Salida esperada:**
```
✔ Generated Prisma Client
✔ Applied migration(s)
```

#### 4A.4. Salir de SSH

```bash
exit
```

### Opción B: Desde tu máquina local

#### 4B.1. Configurar DATABASE_URL

```bash
cd ~/hmp-vitam-repo/backend

export DATABASE_URL="postgresql://postgres:Alexis244143@hmp-vitam-db.cgbkgeo4gv71.us-east-1.rds.amazonaws.com:5432/hmp_vitam?schema=public"
```

#### 4B.2. Verificar conexión

```bash
npx prisma db pull --schema=prisma/schema.prisma
```

Si funciona, continúa. Si no, verifica que tu IP esté permitida en el Security Group de RDS.

#### 4B.3. Ejecutar migración

```bash
npx prisma migrate deploy
```

### Opción C: SQL Manual (Si Prisma falla)

#### 4C.1. Conectarse a RDS con psql

```bash
psql -h hmp-vitam-db.cgbkgeo4gv71.us-east-1.rds.amazonaws.com \
     -U postgres \
     -d hmp_vitam \
     -p 5432
```

Ingresa la contraseña: `Alexis244143`

#### 4C.2. Ejecutar el script SQL

```sql
-- Verificar tablas existentes
\dt

-- Ejecutar script de migración
\i /ruta/completa/a/hmp-vitam-repo/backend/prisma/migrations/manual_add_auth_fields.sql

-- Verificar que se aplicó
\d users
\d sessions
\d audit_logs
```

#### 4C.3. Salir de psql

```sql
\q
```

---

## 🌱 PASO 5: Ejecutar Seed de Datos

### 5.1. Desde la instancia EB

```bash
eb ssh hmp-vitam-backend-prod
cd /var/app/current

# Ejecutar seed
sudo npx prisma db seed
```

**Salida esperada:**
```
✔ Seeding completed
Created users:
- admin@vitam.cl (SUPER_ADMIN)
- clinadmin@vitam.cl (CLINICAL_ADMIN)
- persona@vitam.cl (PERSON)
```

### 5.2. Desde tu máquina local

```bash
cd ~/hmp-vitam-repo/backend

export DATABASE_URL="postgresql://postgres:Alexis244143@hmp-vitam-db.cgbkgeo4gv71.us-east-1.rds.amazonaws.com:5432/hmp_vitam?schema=public"

npx prisma db seed
```

### 5.3. Verificar que los usuarios existen

```bash
# Desde psql
psql -h hmp-vitam-db.cgbkgeo4gv71.us-east-1.rds.amazonaws.com \
     -U postgres \
     -d hmp_vitam \
     -c "SELECT email, \"firstName\", \"lastName\" FROM users;"
```

Deberías ver:
```
       email        | firstName | lastName
--------------------+-----------+----------
 admin@vitam.cl     | Admin     | User
 clinadmin@vitam.cl | Clinical  | Admin
 persona@vitam.cl   | Person    | User
```

---

## 🧪 PASO 6: Probar el Sistema Completo

### 6.1. Test de Health Check

```bash
curl https://hmp-vitam-backend-prod.eba-5c38q8kc.us-east-1.elasticbeanstalk.com/health
```

✅ Debe retornar `"status": "ok"` y `"database": "connected"`

### 6.2. Test de Login

```bash
curl -X POST https://hmp-vitam-backend-prod.eba-5c38q8kc.us-east-1.elasticbeanstalk.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@vitam.cl",
    "password": "Admin123!"
  }' \
  -c cookies.txt \
  -v
```

**Verificar:**
- ✅ Status code: 200
- ✅ Cookie `refreshToken` en los headers
- ✅ JSON con `accessToken` en el body

**Guardar el accessToken para los siguientes tests:**

```bash
# Extraer accessToken del response
ACCESS_TOKEN="<copiar-del-response>"
```

### 6.3. Test de Get Current User

```bash
curl -X GET https://hmp-vitam-backend-prod.eba-5c38q8kc.us-east-1.elasticbeanstalk.com/api/auth/me \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

**Verificar:**
- ✅ Status code: 200
- ✅ JSON con datos del usuario (email, roles, etc.)

### 6.4. Test de Refresh Token

```bash
curl -X POST https://hmp-vitam-backend-prod.eba-5c38q8kc.us-east-1.elasticbeanstalk.com/api/auth/refresh \
  -b cookies.txt \
  -v
```

**Verificar:**
- ✅ Status code: 200
- ✅ Nuevo `accessToken` en el response

### 6.5. Test de Get Sessions

```bash
curl -X GET https://hmp-vitam-backend-prod.eba-5c38q8kc.us-east-1.elasticbeanstalk.com/api/auth/sessions \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

**Verificar:**
- ✅ Status code: 200
- ✅ Array con al menos una sesión activa

### 6.6. Test de Logout

```bash
curl -X POST https://hmp-vitam-backend-prod.eba-5c38q8kc.us-east-1.elasticbeanstalk.com/api/auth/logout \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -b cookies.txt \
  -v
```

**Verificar:**
- ✅ Status code: 200
- ✅ Cookie `refreshToken` eliminada

### 6.7. Test de Endpoint Protegido sin Token

```bash
curl -X GET https://hmp-vitam-backend-prod.eba-5c38q8kc.us-east-1.elasticbeanstalk.com/api/auth/me
```

**Verificar:**
- ✅ Status code: 401
- ✅ Error: "No token provided" o similar

---

## 📊 PASO 7: Verificar en AWS Console

### 7.1. Elastic Beanstalk

1. Ve a **AWS Console > Elastic Beanstalk**
2. Click en `HMP-Vitam`
3. Click en `hmp-vitam-backend-prod`

**Verificar:**
- ✅ Health: Green
- ✅ Status: Ready
- ✅ Recent events: No errors

### 7.2. RDS

1. Ve a **AWS Console > RDS**
2. Click en `hmp-vitam-db`

**Verificar:**
- ✅ Status: Available
- ✅ Connectivity: Accessible from EB

### 7.3. CloudWatch Logs

1. Ve a **AWS Console > CloudWatch > Log groups**
2. Busca `/aws/elasticbeanstalk/hmp-vitam-backend-prod/`

**Verificar:**
- ✅ No hay errores recientes
- ✅ Logs muestran "Server running" y "Database connected"

---

## ✅ PASO 8: Checklist Final

Marca cada item cuando esté completado:

### Despliegue
- [ ] Código desplegado en EB sin errores
- [ ] Entorno en estado "Ready" y "Green"
- [ ] No hay errores en los logs

### Base de Datos
- [ ] Migración ejecutada exitosamente
- [ ] Seed ejecutado exitosamente
- [ ] Usuarios de prueba existen en la BD

### Configuración
- [ ] Variables de entorno configuradas en EB
- [ ] Security Groups permiten conexión EB → RDS
- [ ] CORS configurado correctamente

### Tests
- [ ] Health endpoint responde correctamente
- [ ] Login funciona y retorna tokens
- [ ] Endpoints protegidos requieren autenticación
- [ ] Refresh token funciona
- [ ] Logout funciona
- [ ] Sesiones se registran correctamente

### Documentación
- [ ] README actualizado con URLs de producción
- [ ] Credenciales de prueba documentadas
- [ ] Guías de troubleshooting disponibles

---

## 🚨 Troubleshooting Común

### Problema: "Cannot find module '@prisma/client'"

**Solución:**
```bash
eb ssh hmp-vitam-backend-prod
cd /var/app/current
sudo npm install
sudo npx prisma generate
exit
eb restart
```

### Problema: "Database connection failed"

**Solución:**
1. Verificar Security Groups
2. Verificar DATABASE_URL en variables de entorno
3. Probar conexión desde EB: `nc -zv <rds-host> 5432`

### Problema: "401 Unauthorized" en todos los endpoints

**Solución:**
1. Verificar que JWT_ACCESS_SECRET está configurado
2. Verificar que el token no expiró
3. Verificar formato del header: `Authorization: Bearer <token>`

### Problema: "CORS error" desde frontend

**Solución:**
1. Verificar CORS_ORIGIN en variables de entorno
2. Debe ser: `https://hmp-vitam-aws.vercel.app` (sin trailing slash)
3. Reiniciar EB después de cambiar

---

## 🎉 ¡Despliegue Completado!

Si todos los checks están ✅, tu sistema está **completamente funcional en producción**.

### Próximos Pasos

1. **Actualizar módulos restantes** (ver `TODO_UPDATE_MODULES.md`)
2. **Implementar frontend de autenticación**
3. **Configurar monitoring y alertas**
4. **Implementar CI/CD pipeline**

---

## 📞 Soporte

Si encuentras problemas:

1. Revisa los logs: `eb logs`
2. Consulta `DEPLOYMENT_GUIDE.md`
3. Consulta `FINAL_DEPLOYMENT_STEPS.md`
4. Verifica que seguiste todos los pasos en orden

---

**Última actualización:** 4 de Noviembre, 2025


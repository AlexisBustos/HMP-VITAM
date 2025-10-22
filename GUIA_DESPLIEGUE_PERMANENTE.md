# Guía de Despliegue Permanente - HMP Vitam Healthcare

Esta guía te ayudará a desplegar la aplicación de forma permanente en diferentes plataformas.

## 📋 Tabla de Contenidos

1. [Opción 1: Vercel + Railway (Recomendado - Gratis/Bajo Costo)](#opción-1-vercel--railway)
2. [Opción 2: AWS Completo (Profesional)](#opción-2-aws-completo)
3. [Opción 3: DigitalOcean con Docker (Intermedio)](#opción-3-digitalocean-con-docker)
4. [Opción 4: Render.com (Más Simple)](#opción-4-rendercom)

---

## Opción 1: Vercel + Railway (Recomendado - Gratis/Bajo Costo)

**Costo**: Gratis para empezar, ~$5-10/mes con base de datos
**Dificultad**: ⭐⭐ (Fácil)
**Tiempo**: 15-20 minutos

### Ventajas
- ✅ Despliegue automático desde GitHub
- ✅ SSL/HTTPS incluido
- ✅ CDN global
- ✅ Fácil de configurar

### Paso 1: Preparar el Repositorio

```bash
# 1. Inicializar Git (si no lo has hecho)
cd /ruta/a/hmp
git init
git add .
git commit -m "Initial commit"

# 2. Crear repositorio en GitHub
# Ve a https://github.com/new y crea un nuevo repositorio

# 3. Subir el código
git remote add origin https://github.com/tu-usuario/hmp-vitam.git
git branch -M main
git push -u origin main
```

### Paso 2: Desplegar Frontend en Vercel

1. Ve a https://vercel.com y crea una cuenta (gratis)
2. Haz clic en "Add New Project"
3. Importa tu repositorio de GitHub
4. Configura el proyecto:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Agrega las variables de entorno:
   ```
   VITE_API_URL=https://tu-backend.up.railway.app/api
   ```
6. Haz clic en "Deploy"

### Paso 3: Desplegar Backend en Railway

1. Ve a https://railway.app y crea una cuenta (gratis)
2. Haz clic en "New Project" → "Deploy from GitHub repo"
3. Selecciona tu repositorio
4. Configura el servicio:
   - **Root Directory**: `backend`
   - **Start Command**: `npm run build && npm start`
5. Agrega las variables de entorno:
   ```
   NODE_ENV=production
   PORT=8080
   JWT_SECRET=tu_clave_secreta_muy_larga_y_segura_aqui
   JWT_EXPIRES=7d
   DATABASE_URL=postgresql://user:pass@host:5432/dbname
   CORS_ORIGIN=https://tu-app.vercel.app
   ```
6. Agrega una base de datos PostgreSQL:
   - En Railway, haz clic en "New" → "Database" → "PostgreSQL"
   - Railway generará automáticamente la DATABASE_URL

### Paso 4: Actualizar Prisma para PostgreSQL

Edita `backend/prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### Paso 5: Ejecutar Migraciones

En Railway, ve a la terminal del servicio backend y ejecuta:

```bash
npx prisma migrate deploy
npx prisma db seed
```

### Paso 6: Configurar CORS

Actualiza la variable `CORS_ORIGIN` en Railway con la URL de tu frontend en Vercel.

**¡Listo!** Tu aplicación estará disponible en:
- Frontend: `https://tu-app.vercel.app`
- Backend: `https://tu-backend.up.railway.app`

---

## Opción 2: AWS Completo (Profesional)

**Costo**: ~$50-100/mes
**Dificultad**: ⭐⭐⭐⭐⭐ (Avanzado)
**Tiempo**: 2-3 horas

### Servicios AWS Necesarios

- **Frontend**: S3 + CloudFront
- **Backend**: EC2 o Elastic Beanstalk
- **Base de Datos**: RDS (MySQL)
- **Storage**: S3 para archivos
- **Dominio**: Route 53

### Paso 1: Configurar Base de Datos RDS

```bash
# Crear instancia RDS MySQL
aws rds create-db-instance \
  --db-instance-identifier hmp-db \
  --db-instance-class db.t3.micro \
  --engine mysql \
  --engine-version 8.0 \
  --master-username admin \
  --master-user-password TuPasswordSeguro123 \
  --allocated-storage 20 \
  --db-name hmp_db \
  --backup-retention-period 7 \
  --storage-encrypted \
  --publicly-accessible
```

### Paso 2: Configurar S3 para Frontend

```bash
# Crear bucket para frontend
aws s3 mb s3://hmp-frontend --region us-east-1

# Habilitar hosting estático
aws s3 website s3://hmp-frontend \
  --index-document index.html \
  --error-document index.html

# Configurar política pública
cat > bucket-policy.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "PublicReadGetObject",
    "Effect": "Allow",
    "Principal": "*",
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::hmp-frontend/*"
  }]
}
EOF

aws s3api put-bucket-policy \
  --bucket hmp-frontend \
  --policy file://bucket-policy.json
```

### Paso 3: Construir y Subir Frontend

```bash
cd frontend

# Configurar variable de entorno
echo "VITE_API_URL=https://api.tu-dominio.com/api" > .env.production

# Construir
npm run build

# Subir a S3
aws s3 sync dist/ s3://hmp-frontend --delete
```

### Paso 4: Configurar CloudFront

1. Ve a la consola de CloudFront
2. Crea una nueva distribución
3. Configura:
   - **Origin Domain**: hmp-frontend.s3-website-us-east-1.amazonaws.com
   - **Viewer Protocol Policy**: Redirect HTTP to HTTPS
   - **Alternate Domain Names**: app.tu-dominio.com
   - **SSL Certificate**: Solicita uno en ACM
4. Espera 15-20 minutos a que se propague

### Paso 5: Desplegar Backend en EC2

```bash
# 1. Lanzar instancia EC2 (Amazon Linux 2023, t3.small)
# 2. Conectarse por SSH
ssh -i tu-clave.pem ec2-user@tu-ip

# 3. Instalar Node.js
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo yum install -y nodejs git

# 4. Clonar repositorio
git clone https://github.com/tu-usuario/hmp-vitam.git
cd hmp-vitam/backend

# 5. Instalar dependencias
npm install

# 6. Configurar .env
cat > .env <<EOF
NODE_ENV=production
PORT=8080
JWT_SECRET=tu_clave_secreta_muy_larga
DATABASE_URL=mysql://admin:password@hmp-db.xxxxx.us-east-1.rds.amazonaws.com:3306/hmp_db
AWS_REGION=us-east-1
AWS_S3_BUCKET=hmp-vitam-bucket
CORS_ORIGIN=https://app.tu-dominio.com
EOF

# 7. Ejecutar migraciones
npx prisma migrate deploy
npx prisma db seed

# 8. Construir
npm run build

# 9. Instalar PM2
sudo npm install -g pm2

# 10. Iniciar aplicación
pm2 start dist/server.js --name hmp-api
pm2 save
pm2 startup
```

### Paso 6: Configurar Nginx

```bash
sudo yum install -y nginx

# Configurar Nginx
sudo tee /etc/nginx/conf.d/hmp.conf <<EOF
server {
    listen 80;
    server_name api.tu-dominio.com;

    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

sudo systemctl start nginx
sudo systemctl enable nginx
```

### Paso 7: Configurar SSL con Certbot

```bash
sudo yum install -y certbot python3-certbot-nginx
sudo certbot --nginx -d api.tu-dominio.com
```

---

## Opción 3: DigitalOcean con Docker (Intermedio)

**Costo**: ~$12-24/mes
**Dificultad**: ⭐⭐⭐ (Intermedio)
**Tiempo**: 1 hora

### Paso 1: Crear Droplet

1. Ve a https://digitalocean.com
2. Crea un Droplet (Ubuntu 22.04, $12/mes)
3. Agrega tu clave SSH

### Paso 2: Conectarse y Configurar

```bash
ssh root@tu-ip

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### Paso 3: Crear docker-compose.yml

```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: hmp_db
      MYSQL_USER: hmp_user
      MYSQL_PASSWORD: hmp_password
    volumes:
      - mysql_data:/var/lib/mysql
    ports:
      - "3306:3306"

  backend:
    build: ./backend
    environment:
      NODE_ENV: production
      PORT: 8080
      JWT_SECRET: tu_clave_secreta
      DATABASE_URL: mysql://hmp_user:hmp_password@mysql:3306/hmp_db
      CORS_ORIGIN: https://tu-dominio.com
    ports:
      - "8080:8080"
    depends_on:
      - mysql

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  mysql_data:
```

### Paso 4: Desplegar

```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/hmp-vitam.git
cd hmp-vitam

# Construir e iniciar
docker-compose up -d

# Ver logs
docker-compose logs -f
```

---

## Opción 4: Render.com (Más Simple)

**Costo**: Gratis para empezar, ~$7/mes con base de datos
**Dificultad**: ⭐ (Muy Fácil)
**Tiempo**: 10 minutos

### Paso 1: Crear cuenta en Render

Ve a https://render.com y crea una cuenta

### Paso 2: Desplegar Backend

1. Haz clic en "New +" → "Web Service"
2. Conecta tu repositorio de GitHub
3. Configura:
   - **Name**: hmp-backend
   - **Root Directory**: backend
   - **Build Command**: `npm install && npx prisma generate && npm run build`
   - **Start Command**: `npm start`
4. Agrega variables de entorno
5. Haz clic en "Create Web Service"

### Paso 3: Crear Base de Datos

1. Haz clic en "New +" → "PostgreSQL"
2. Copia la DATABASE_URL
3. Agrégala a las variables de entorno del backend

### Paso 4: Desplegar Frontend

1. Haz clic en "New +" → "Static Site"
2. Conecta tu repositorio
3. Configura:
   - **Root Directory**: frontend
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: dist
4. Agrega variable de entorno:
   ```
   VITE_API_URL=https://hmp-backend.onrender.com/api
   ```

---

## 🔒 Checklist de Seguridad

Antes de poner en producción, asegúrate de:

- [ ] Cambiar JWT_SECRET a un valor aleatorio largo
- [ ] Configurar CORS solo para tu dominio
- [ ] Habilitar HTTPS/SSL
- [ ] Usar contraseñas fuertes para la base de datos
- [ ] Configurar backups automáticos
- [ ] Configurar variables de entorno (nunca hardcodear)
- [ ] Actualizar dependencias regularmente
- [ ] Configurar monitoreo (Sentry, LogRocket, etc.)

---

## 📞 Soporte

Si necesitas ayuda con el despliegue, puedes:
- Revisar la documentación de cada plataforma
- Contactar al soporte de la plataforma elegida
- Consultar con un DevOps profesional

---

**Recomendación Final**: Para empezar rápido y sin costo, usa **Opción 1 (Vercel + Railway)**. Es la más fácil y te permite escalar después.


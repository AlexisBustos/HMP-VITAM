#!/bin/bash

# Script de despliegue para AWS
# Este script ayuda a configurar la infraestructura de AWS para HMP Vitam Healthcare

set -e

echo "🚀 HMP Vitam Healthcare - Script de Despliegue AWS"
echo "=================================================="

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Variables (modificar según necesidad)
BUCKET_NAME="hmp-vitam-bucket"
REGION="us-east-1"
DB_NAME="hmp_db"
DB_USER="hmp_admin"

echo ""
echo -e "${YELLOW}1. Crear bucket S3 para archivos clínicos${NC}"
echo "-------------------------------------------"
aws s3 mb s3://${BUCKET_NAME} --region ${REGION} || echo "Bucket ya existe"

echo ""
echo -e "${YELLOW}2. Configurar CORS en S3${NC}"
echo "-------------------------"
aws s3api put-bucket-cors --bucket ${BUCKET_NAME} --cors-configuration file://s3/cors.json
echo -e "${GREEN}✓ CORS configurado${NC}"

echo ""
echo -e "${YELLOW}3. Habilitar encriptación en S3${NC}"
echo "--------------------------------"
aws s3api put-bucket-encryption \
  --bucket ${BUCKET_NAME} \
  --server-side-encryption-configuration '{
    "Rules": [{
      "ApplyServerSideEncryptionByDefault": {
        "SSEAlgorithm": "AES256"
      }
    }]
  }'
echo -e "${GREEN}✓ Encriptación habilitada${NC}"

echo ""
echo -e "${YELLOW}4. Crear usuario IAM para S3${NC}"
echo "-----------------------------"
aws iam create-user --user-name hmp-api-s3 || echo "Usuario ya existe"
aws iam put-user-policy --user-name hmp-api-s3 --policy-name HmpS3Access --policy-document file://iam/s3-policy.json
echo -e "${GREEN}✓ Usuario IAM creado y política aplicada${NC}"

echo ""
echo -e "${YELLOW}5. Generar credenciales de acceso${NC}"
echo "----------------------------------"
echo "Ejecute el siguiente comando para generar las credenciales:"
echo "aws iam create-access-key --user-name hmp-api-s3"
echo ""
echo "Guarde AWS_ACCESS_KEY_ID y AWS_SECRET_ACCESS_KEY en el archivo .env del backend"

echo ""
echo -e "${YELLOW}6. Crear base de datos RDS (MySQL)${NC}"
echo "-----------------------------------"
echo "Puede crear la instancia RDS desde la consola de AWS o usando el CLI:"
echo ""
echo "aws rds create-db-instance \\"
echo "  --db-instance-identifier hmp-db \\"
echo "  --db-instance-class db.t3.micro \\"
echo "  --engine mysql \\"
echo "  --engine-version 8.0 \\"
echo "  --master-username ${DB_USER} \\"
echo "  --master-user-password YOUR_PASSWORD \\"
echo "  --allocated-storage 20 \\"
echo "  --db-name ${DB_NAME} \\"
echo "  --backup-retention-period 7 \\"
echo "  --storage-encrypted \\"
echo "  --publicly-accessible"
echo ""
echo "Después de crear la instancia, obtenga el endpoint y actualice DATABASE_URL en .env"

echo ""
echo -e "${YELLOW}7. Configurar EC2 para el backend${NC}"
echo "----------------------------------"
echo "1. Lanzar instancia EC2 (Amazon Linux 2023, t3.small o superior)"
echo "2. Configurar Security Group para permitir puertos 22, 80, 443"
echo "3. Conectarse vía SSH e instalar Node.js 20:"
echo "   curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -"
echo "   sudo yum install -y nodejs"
echo "4. Instalar PM2 globalmente:"
echo "   sudo npm install -g pm2"
echo "5. Instalar Nginx:"
echo "   sudo yum install -y nginx"
echo "6. Copiar configuración de Nginx:"
echo "   sudo cp nginx/hmp.conf /etc/nginx/conf.d/"
echo "7. Instalar Certbot para SSL:"
echo "   sudo yum install -y certbot python3-certbot-nginx"
echo "   sudo certbot --nginx -d api.hmp.vitam.cl"

echo ""
echo -e "${YELLOW}8. Desplegar frontend en S3 + CloudFront${NC}"
echo "-----------------------------------------"
echo "1. Crear bucket S3 para el frontend:"
echo "   aws s3 mb s3://hmp-frontend --region ${REGION}"
echo "2. Habilitar hosting estático:"
echo "   aws s3 website s3://hmp-frontend --index-document index.html --error-document index.html"
echo "3. Construir el frontend:"
echo "   cd ../frontend && npm run build"
echo "4. Subir archivos a S3:"
echo "   aws s3 sync dist/ s3://hmp-frontend --delete"
echo "5. Crear distribución de CloudFront desde la consola de AWS"
echo "6. Configurar dominio personalizado (app.hmp.vitam.cl) con certificado ACM"

echo ""
echo -e "${GREEN}✅ Guía de despliegue completada${NC}"
echo ""
echo "Próximos pasos:"
echo "1. Configurar todas las variables de entorno en el servidor EC2"
echo "2. Ejecutar migraciones de Prisma: npx prisma migrate deploy"
echo "3. Ejecutar seed: npm run seed"
echo "4. Iniciar el backend con PM2: pm2 start dist/server.js --name hmp-api"
echo "5. Configurar GitHub Actions con los secrets necesarios"
echo ""
echo "Para más información, consulte el README.md del proyecto"


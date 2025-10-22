#!/bin/bash

# Script de despliegue rápido con Docker
# Para usar en cualquier servidor con Docker instalado

set -e

echo "🚀 HMP Vitam Healthcare - Despliegue con Docker"
echo "================================================"

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Verificar que Docker está instalado
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker no está instalado${NC}"
    echo "Instala Docker desde: https://docs.docker.com/get-docker/"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose no está instalado${NC}"
    echo "Instala Docker Compose desde: https://docs.docker.com/compose/install/"
    exit 1
fi

echo -e "${GREEN}✓ Docker y Docker Compose están instalados${NC}"

# Verificar archivo .env
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠ Archivo .env no encontrado${NC}"
    echo "Copiando .env.docker como plantilla..."
    cp .env.docker .env
    echo -e "${YELLOW}⚠ IMPORTANTE: Edita el archivo .env con tus credenciales antes de continuar${NC}"
    echo "Presiona Enter cuando hayas editado el archivo .env..."
    read
fi

echo ""
echo -e "${YELLOW}1. Detener contenedores existentes${NC}"
docker-compose down

echo ""
echo -e "${YELLOW}2. Construir imágenes${NC}"
docker-compose build --no-cache

echo ""
echo -e "${YELLOW}3. Iniciar servicios${NC}"
docker-compose up -d

echo ""
echo -e "${YELLOW}4. Esperar a que MySQL esté listo${NC}"
sleep 10

echo ""
echo -e "${YELLOW}5. Ejecutar migraciones de base de datos${NC}"
docker-compose exec backend npx prisma migrate deploy

echo ""
echo -e "${YELLOW}6. Ejecutar seed de datos iniciales${NC}"
docker-compose exec backend npx prisma db seed || echo "Seed ya ejecutado o falló"

echo ""
echo -e "${GREEN}✅ Despliegue completado${NC}"
echo ""
echo "================================================"
echo "🎉 Aplicación disponible en:"
echo ""
echo "  Frontend: http://localhost"
echo "  Backend:  http://localhost:8080"
echo "  API Docs: http://localhost:8080/api-docs"
echo ""
echo "================================================"
echo ""
echo "📝 Próximos pasos:"
echo ""
echo "1. Crear usuario administrador:"
echo "   curl -X POST http://localhost:8080/api/auth/register \\"
echo "     -H 'Content-Type: application/json' \\"
echo "     -d '{\"email\":\"admin@hmp.cl\",\"password\":\"Admin123456\",\"firstName\":\"Admin\",\"lastName\":\"General\",\"roleId\":1}'"
echo ""
echo "2. Ver logs:"
echo "   docker-compose logs -f"
echo ""
echo "3. Detener aplicación:"
echo "   docker-compose down"
echo ""
echo "4. Reiniciar aplicación:"
echo "   docker-compose restart"
echo ""


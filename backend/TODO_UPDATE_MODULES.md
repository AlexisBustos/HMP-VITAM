# TODO: Actualizar Módulos para UUID

## Estado Actual

Los siguientes módulos están **temporalmente deshabilitados** porque necesitan actualización para ser compatibles con el nuevo esquema de base de datos que usa UUIDs (String) en lugar de números enteros para los IDs.

### Módulos Deshabilitados

- ❌ `pacientes`
- ❌ `consultas`
- ❌ `examenes`
- ❌ `seguimiento`
- ❌ `uploads`
- ❌ `dashboard`

### Módulos Funcionales

- ✅ `auth` - Sistema de autenticación completo
- ✅ `users` - Gestión de usuarios

---

## Cambios Necesarios

Para cada módulo, se deben realizar los siguientes cambios:

### 1. Tipos de IDs

**Antes:**
```typescript
const id = parseInt(req.params.id);
const pacienteId: number = req.body.pacienteId;
```

**Después:**
```typescript
const id = req.params.id; // Ya es string
const pacienteId: string = req.body.pacienteId;
```

### 2. Validación de IDs

**Antes:**
```typescript
if (isNaN(id)) {
  throw new AppError(400, "ID inválido");
}
```

**Después:**
```typescript
// Eliminar validación isNaN, UUID validation se hace en Prisma
// O agregar validación de UUID si es necesario:
if (!id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
  throw new AppError(400, "ID inválido");
}
```

### 3. Request Type con req.user

**Antes:**
```typescript
import { Request, Response } from "express";

export async function getPacientes(req: Request, res: Response) {
  const user = req.user!; // Error: Property 'user' does not exist
}
```

**Después:**
```typescript
import { Request, Response } from "express";
import { AuthRequest } from "../common/auth.middleware";

export async function getPacientes(req: AuthRequest, res: Response) {
  const user = req.user!; // ✓ Correcto
}
```

### 4. Propiedades de Usuario

**Antes:**
```typescript
const userId = user.id;
const userRole = user.role;
```

**Después:**
```typescript
const userId = user.userId;
const userRoles = user.roles; // Array de strings
if (user.roles.includes("SUPER_ADMIN")) {
  // ...
}
```

### 5. Relaciones de Prisma

**Antes:**
```typescript
const user = await prisma.user.findUnique({
  where: { id: userId },
  include: { paciente: true }
});

if (user.paciente) {
  // ...
}
```

**Después:**
```typescript
const user = await prisma.user.findUnique({
  where: { id: userId }
});

// Buscar paciente por separado
const paciente = await prisma.paciente.findFirst({
  where: { userId: userId }
});

if (paciente) {
  // ...
}
```

---

## Checklist por Módulo

### Pacientes

- [ ] Cambiar `parseInt(req.params.id)` a `req.params.id`
- [ ] Cambiar `userId?: number` a `userId?: string`
- [ ] Cambiar `req: Request` a `req: AuthRequest` en funciones que usan `req.user`
- [ ] Cambiar `user.id` a `user.userId`
- [ ] Cambiar `user.role` a `user.roles.includes(...)`
- [ ] Actualizar relación `user.paciente` a búsqueda separada
- [ ] Eliminar validaciones `isNaN`

### Consultas

- [ ] Cambiar `parseInt(req.body.pacienteId)` a `req.body.pacienteId`
- [ ] Cambiar `parseInt(req.body.createdBy)` a `req.body.createdBy`
- [ ] Cambiar `req: Request` a `req: AuthRequest`
- [ ] Cambiar `user.id` a `user.userId`
- [ ] Actualizar tipos de variables de `number` a `string`

### Exámenes

- [ ] Cambiar `parseInt(req.body.pacienteId)` a `req.body.pacienteId`
- [ ] Cambiar `pacienteId?: number` a `pacienteId?: string`
- [ ] Actualizar tipos en create y update

### Seguimiento

- [ ] Cambiar `parseInt(req.body.pacienteId)` a `req.body.pacienteId`
- [ ] Cambiar `pacienteId?: number` a `pacienteId?: string`
- [ ] Actualizar tipos en create y update

### Uploads

- [ ] Cambiar `parseInt(req.params.pacienteId)` a `req.params.pacienteId`
- [ ] Actualizar tipo de `pacienteId` de `number` a `string`

### Dashboard

- [ ] Revisar y actualizar queries que usen IDs
- [ ] Actualizar agregaciones si es necesario

---

## Pasos para Habilitar un Módulo

1. **Hacer los cambios necesarios** en el controller del módulo
2. **Remover el módulo de la exclusión** en `tsconfig.json`:
   ```json
   "exclude": [
     "node_modules",
     "dist",
     // "src/modules/pacientes/**",  // ← Descomentar
     "src/modules/consultas/**",
     // ...
   ]
   ```
3. **Descomentar la ruta** en `src/app.ts`:
   ```typescript
   // app.use("/api/pacientes", pacientesRoutes);  // ← Descomentar
   ```
4. **Descomentar el import** en `src/app.ts`:
   ```typescript
   // import pacientesRoutes from "./modules/pacientes/pacientes.routes";  // ← Descomentar
   ```
5. **Compilar y verificar**:
   ```bash
   npm run build
   ```
6. **Probar el módulo** con requests HTTP
7. **Commit los cambios**:
   ```bash
   git add .
   git commit -m "feat: Enable pacientes module with UUID support"
   git push origin main
   ```

---

## Script de Ayuda

Puedes usar este script como punto de partida para actualizar un módulo:

```bash
#!/bin/bash

MODULE_NAME="pacientes"  # Cambiar según el módulo
MODULE_PATH="src/modules/$MODULE_NAME"

echo "Updating $MODULE_NAME module..."

# Remove parseInt for IDs
sed -i 's/parseInt(req\.params\.id)/req.params.id/g' "$MODULE_PATH/${MODULE_NAME}.controller.ts"
sed -i 's/parseInt(req\.body\.pacienteId)/req.body.pacienteId/g' "$MODULE_PATH/${MODULE_NAME}.controller.ts"

# Change number to string types
sed -i 's/: number = req\.params/: string = req.params/g' "$MODULE_PATH/${MODULE_NAME}.controller.ts"
sed -i 's/: number = req\.body/: string = req.body/g' "$MODULE_PATH/${MODULE_NAME}.controller.ts"

# Remove isNaN checks
sed -i '/if (isNaN(/,/}$/d' "$MODULE_PATH/${MODULE_NAME}.controller.ts"

echo "Manual review required for:"
echo "- req: Request → req: AuthRequest"
echo "- user.id → user.userId"
echo "- user.role → user.roles.includes(...)"
echo "- Prisma relations"

echo "Done! Please review and test."
```

---

## Testing

Después de actualizar cada módulo, probar:

```bash
# Health check
curl http://localhost:8080/health

# Test endpoint del módulo
curl -X GET http://localhost:8080/api/pacientes \
  -H "Authorization: Bearer <access-token>"

# Test create
curl -X POST http://localhost:8080/api/pacientes \
  -H "Authorization: Bearer <access-token>" \
  -H "Content-Type: application/json" \
  -d '{"rut":"12345678-9","firstName":"Juan","lastName":"Pérez",...}'
```

---

## Prioridad de Actualización

Recomendación de orden para actualizar los módulos:

1. **Pacientes** (alta prioridad) - Core del sistema
2. **Consultas** (alta prioridad) - Depende de pacientes
3. **Exámenes** (media prioridad) - Depende de pacientes
4. **Seguimiento** (media prioridad) - Depende de pacientes
5. **Uploads** (baja prioridad) - Funcionalidad auxiliar
6. **Dashboard** (baja prioridad) - Solo lectura/estadísticas

---

## Notas

- Los cambios son **mecánicos y repetitivos**, perfectos para automatización
- El esquema de Prisma ya está actualizado con UUIDs
- La migración de base de datos ya está lista
- El sistema de autenticación funciona perfectamente como referencia

---

**Última actualización:** 4 de Noviembre, 2025


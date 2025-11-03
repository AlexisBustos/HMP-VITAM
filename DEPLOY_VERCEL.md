# Guía de Despliegue en Vercel - HMP Vitam

## 🚀 Despliegue Automático desde GitHub

### Opción 1: Importar desde Vercel Dashboard (Recomendado)

1. **Ve a Vercel**: https://vercel.com
2. **Inicia sesión** con tu cuenta de GitHub
3. **Clic en "Add New Project"**
4. **Importa el repositorio**: `AlexisBustos/HMP-VITAM`
5. **Configura el proyecto**:

   ```
   Framework Preset: Vite
   Root Directory: frontend
   Build Command: pnpm run build
   Output Directory: dist
   Install Command: pnpm install
   Node Version: 18.x
   ```

6. **Variables de Entorno** (si es necesario):
   ```
   NODE_VERSION=18
   ```

7. **Clic en "Deploy"**

### Opción 2: Usando Vercel CLI

```bash
# Instalar Vercel CLI globalmente
npm install -g vercel

# Ir al directorio del proyecto
cd /home/ubuntu/hmp

# Login a Vercel
vercel login

# Desplegar
vercel --prod
```

---

## ⚙️ Configuración del Proyecto

El archivo `vercel.json` ya está configurado con:

```json
{
  "version": 2,
  "buildCommand": "cd frontend && pnpm install && pnpm run build",
  "outputDirectory": "frontend/dist",
  "framework": "vite",
  "installCommand": "cd frontend && pnpm install"
}
```

---

## 🔄 Despliegue Continuo

Una vez configurado, **cada push a `main`** desplegará automáticamente:

```bash
git add .
git commit -m "feat: nueva funcionalidad"
git push origin main
# Vercel detecta el push y despliega automáticamente
```

---

## 📋 Checklist de Verificación

Después del despliegue, verifica:

- [ ] La aplicación carga correctamente
- [ ] El menú de navegación funciona
- [ ] El módulo de Encuestas está accesible
- [ ] El botón flotante **+** aparece en `/encuestas`
- [ ] El modal de nueva encuesta se abre correctamente
- [ ] La búsqueda por RUT funciona
- [ ] Las encuestas se pueden completar
- [ ] Los resultados se guardan en localStorage
- [ ] La ficha del paciente muestra las evaluaciones

---

## 🌐 URLs Esperadas

Después del despliegue, tendrás:

- **Producción**: `https://tu-proyecto.vercel.app`
- **Preview**: `https://hmp-vitam-git-main-alexisbustos.vercel.app`

---

## 🐛 Troubleshooting

### Error: "Build failed"
- Verifica que `pnpm-lock.yaml` esté en el repositorio
- Asegúrate de que `package.json` tenga todos los scripts necesarios

### Error: "404 Not Found"
- Verifica que `outputDirectory` sea `frontend/dist`
- Asegúrate de que las rutas en `vercel.json` estén correctas

### El modal no aparece
- Haz un **hard refresh**: Ctrl+Shift+R (Windows/Linux) o Cmd+Shift+R (Mac)
- Limpia el cache del navegador
- Abre en modo incógnito

### Los cambios no se reflejan
- Verifica que el commit esté en GitHub: `git log --oneline -1`
- Ve al dashboard de Vercel y verifica el último deployment
- Espera 2-3 minutos para que el deployment termine

---

## 📊 Estado Actual

**Último commit**: `fd3cb84 - chore: Force Vercel redeploy`

**Archivos clave**:
- ✅ `frontend/src/components/NewSurveyModal.tsx` - Modal de nueva encuesta
- ✅ `frontend/src/pages/Encuestas/EncuestasList.tsx` - Vista principal con botón +
- ✅ `frontend/src/pages/Pacientes/PacienteDetail.tsx` - Ficha con evaluaciones
- ✅ `vercel.json` - Configuración de Vercel

**Build status**: ✅ Compilación exitosa (400.42 kB)

---

## 🔗 Enlaces Útiles

- **Documentación de Vercel**: https://vercel.com/docs
- **Vercel + Vite**: https://vercel.com/docs/frameworks/vite
- **GitHub Repository**: https://github.com/AlexisBustos/HMP-VITAM

---

## 📞 Soporte

Si tienes problemas con el despliegue:

1. Verifica los logs en Vercel Dashboard
2. Revisa la consola del navegador (F12)
3. Asegúrate de que todos los commits estén en GitHub
4. Intenta un redeploy manual desde Vercel

---

**Fecha de última actualización**: 3 de Noviembre, 2024


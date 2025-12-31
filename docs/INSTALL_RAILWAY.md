# Instalación en Railway - Community Manager Pro v2.0

Railway es una plataforma moderna y fácil de usar para desplegar aplicaciones. Ofrece un tier gratuito generoso y es ideal para Community Manager Pro.

## Requisitos Previos

- Cuenta en [Railway](https://railway.app)
- Repositorio GitHub con el proyecto
- Tarjeta de crédito (para verificación, no se cobra si usas el tier gratuito)

## Paso 1: Preparar el Repositorio

### 1.1 Crear repositorio en GitHub

1. Ve a [GitHub](https://github.com/new)
2. Crea un nuevo repositorio: `community-manager-pro`
3. Clona el repositorio:

```bash
git clone https://github.com/tu-usuario/community-manager-pro.git
cd community-manager-pro
```

### 1.2 Agregar archivos del proyecto

```bash
# Copiar todos los archivos del proyecto
cp -r /ruta/al/community-manager-optimized/* .

# Hacer commit inicial
git add .
git commit -m "Initial commit: Community Manager Pro v2.0"
git push origin main
```

### 1.3 Crear archivo railway.json

Crea `railway.json` en la raíz del proyecto:

```json
{
  "build": {
    "builder": "nixpacks"
  },
  "deploy": {
    "numReplicas": 1,
    "startCommand": "npm run build && npm start",
    "restartPolicyMaxRetries": 5
  }
}
```

## Paso 2: Crear Proyecto en Railway

### 2.1 Conectar GitHub

1. Ve a [Railway](https://railway.app)
2. Haz clic en "New Project"
3. Selecciona "Deploy from GitHub repo"
4. Autoriza Railway para acceder a GitHub
5. Selecciona tu repositorio `community-manager-pro`

### 2.2 Configurar el Proyecto

1. Railway detectará automáticamente que es un proyecto Node.js
2. Haz clic en "Deploy"
3. Espera a que se complete la compilación (5-10 minutos)

## Paso 3: Configurar Base de Datos

### 3.1 Agregar MySQL

1. En el dashboard de Railway, haz clic en "Add Service"
2. Selecciona "MySQL"
3. Configura:
   - **Version**: 8.0
   - **Name**: database
4. Haz clic en "Deploy"

### 3.2 Obtener Credenciales

1. Haz clic en el servicio MySQL
2. Ve a la pestaña "Variables"
3. Copia la variable `DATABASE_URL`

## Paso 4: Configurar Variables de Entorno

### 4.1 Agregar Variables en Railway

1. En el dashboard, selecciona tu aplicación Node.js
2. Ve a la pestaña "Variables"
3. Haz clic en "Raw Editor"
4. Pega las siguientes variables:

```env
DATABASE_URL=mysql://root:password@host:3306/railway
JWT_SECRET=tu-secreto-super-seguro-minimo-32-caracteres-aleatorio
NODE_ENV=production
APP_URL=https://tu-proyecto.railway.app
PORT=3000
```

5. Haz clic en "Update"

### 4.2 Obtener URL de la Aplicación

1. Ve a la pestaña "Deployments"
2. Copia la URL pública (algo como `https://tu-proyecto-xxxxx.railway.app`)
3. Actualiza `APP_URL` con esta URL

## Paso 5: Migrar Base de Datos

### 5.1 Usar Railway CLI

```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Conectar con tu proyecto
railway link

# Ejecutar migraciones
railway run npm run db:push
```

### 5.2 Alternativa: Ejecutar en el Servidor

1. En Railway, ve a "Deployments"
2. Haz clic en "View Logs"
3. Busca la URL de la aplicación
4. Accede a `/health` para verificar que está en línea

## Paso 6: Verificar Despliegue

1. Accede a tu URL: `https://tu-proyecto-xxxxx.railway.app`
2. Deberías ver la aplicación cargando
3. Verifica el endpoint `/health`:

```bash
curl https://tu-proyecto-xxxxx.railway.app/health
```

Deberías recibir:

```json
{"status":"ok","timestamp":"2024-12-30T..."}
```

## Configuración Avanzada

### Usar Dominio Personalizado

1. En Railway, ve a "Settings"
2. Busca "Custom Domain"
3. Ingresa tu dominio (ej: `app.tu-dominio.com`)
4. Configura los registros DNS:
   - Tipo: CNAME
   - Nombre: `app`
   - Valor: `tu-proyecto-xxxxx.railway.app`
5. Espera a que se propague (5-30 minutos)
6. Actualiza `APP_URL` en las variables de entorno

### Configurar Backups Automáticos

1. En el servicio MySQL, ve a "Backups"
2. Habilita backups automáticos
3. Configura la frecuencia (diaria recomendada)

### Monitoreo y Logs

1. Ve a "Deployments"
2. Haz clic en "View Logs" para ver logs en tiempo real
3. Ve a "Metrics" para ver uso de CPU, memoria, etc.

### Escalar la Aplicación

1. En "Settings", busca "Instance Type"
2. Selecciona un plan más potente si es necesario
3. Railway escala automáticamente según el uso

## Solución de Problemas

### Error: "Build failed"

```bash
# Verificar localmente
npm install
npm run build
npm run check
```

### Error: "Database connection refused"

1. Verifica que MySQL está en línea
2. Comprueba `DATABASE_URL` en las variables
3. Reinicia ambos servicios

### La aplicación se reinicia constantemente

1. Revisa los logs en "View Logs"
2. Busca errores de tipo
3. Verifica que todas las variables de entorno están configuradas

### Rendimiento lento

1. Verifica el uso de CPU/memoria en "Metrics"
2. Optimiza las consultas a la base de datos
3. Considera actualizar el plan

## Límites del Tier Gratuito

- $5 USD de crédito gratuito por mes
- Suficiente para una aplicación pequeña
- Después se requiere tarjeta de crédito (pay-as-you-go)

## Costos Estimados

- Aplicación Node.js: ~$0.10/hora (en tier gratuito)
- Base de datos MySQL: ~$5/mes (en tier gratuito)
- **Total**: Cubierto por el crédito gratuito de $5/mes

## Próximos Pasos

1. Configura un dominio personalizado
2. Implementa autenticación OAuth
3. Configura monitoreo y alertas
4. Automatiza los backups
5. Configura CI/CD con GitHub Actions

## Actualizar la Aplicación

```bash
# Hacer cambios localmente
git add .
git commit -m "Descripción de cambios"
git push origin main

# Railway automáticamente redesplegará
```

## Soporte

- Documentación de Railway: https://docs.railway.app
- Comunidad: https://railway.app/support
- Discord: https://discord.gg/railway

## Comparación con Otras Plataformas

| Plataforma | Tier Gratuito | Facilidad | Mejor Para |
|-----------|--------------|----------|-----------|
| Railway | $5/mes | ⭐⭐⭐⭐⭐ | Producción pequeña |
| Render | Limitado | ⭐⭐⭐⭐ | Desarrollo |
| Vercel | Generoso | ⭐⭐⭐⭐⭐ | Frontend estático |
| Heroku | Descontinuado | - | - |
| cPanel | Según host | ⭐⭐⭐ | Hosting tradicional |

Railway es la opción recomendada para Community Manager Pro.

# Instalación en Bolt.new - Community Manager Pro v2.0

Bolt.new es una plataforma ideal para prototipos y desarrollo rápido. Esta guía te muestra cómo desplegar Community Manager Pro allí.

## Requisitos Previos

- Cuenta en [bolt.new](https://bolt.new)
- Archivo del proyecto comprimido o repositorio Git
- Base de datos MySQL externa (Planetscale, AWS RDS, etc.)

## Paso 1: Preparar el Proyecto

### 1.1 Simplificar la estructura para Bolt.new

Bolt.new funciona mejor con proyectos más simples. Crea una versión simplificada:

```bash
# Crear carpeta para Bolt
mkdir community-manager-bolt
cd community-manager-bolt

# Copiar solo lo necesario
cp -r src/ .
cp -r server/ .
cp -r shared/ .
cp -r drizzle/ .
cp package.json .
cp .env.example .
cp vite.config.ts .
cp tsconfig.json .
```

### 1.2 Actualizar package.json para Bolt

Edita `package.json` y simplifica los scripts:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "start": "vite preview --port 3000"
  }
}
```

## Paso 2: Crear Proyecto en Bolt.new

### 2.1 Acceder a Bolt.new

1. Ve a [bolt.new](https://bolt.new)
2. Haz clic en "Create New Project"
3. Selecciona "React + TypeScript"

### 2.2 Cargar el Proyecto

1. Haz clic en "Import from GitHub" o "Upload Files"
2. Si usas GitHub:
   - Conecta tu repositorio
   - Selecciona la rama principal
3. Si usas upload:
   - Comprime la carpeta `community-manager-bolt`
   - Sube el archivo ZIP

### 2.3 Configurar Variables de Entorno

1. En Bolt.new, ve a "Settings" → "Environment Variables"
2. Añade las siguientes variables:

```env
DATABASE_URL=mysql://usuario:password@host:3306/database
JWT_SECRET=tu-secreto-super-seguro-minimo-32-caracteres
NODE_ENV=production
APP_URL=https://tu-proyecto.bolt.new
```

## Paso 3: Configurar Base de Datos

### Opción A: PlanetScale (Recomendado)

1. Crea cuenta en [PlanetScale](https://planetscale.com)
2. Crea una nueva base de datos
3. Copia la cadena de conexión
4. Pégala en `DATABASE_URL` en Bolt.new

### Opción B: AWS RDS

1. Crea una instancia MySQL en AWS RDS
2. Configura los grupos de seguridad
3. Obtén la cadena de conexión
4. Pégala en `DATABASE_URL`

### Opción C: Base de Datos Local

Si Bolt.new tiene acceso a tu red:

```env
DATABASE_URL=mysql://usuario:password@tu-servidor.local:3306/database
```

## Paso 4: Instalar Dependencias

En la terminal de Bolt.new:

```bash
npm install
```

## Paso 5: Migrar Base de Datos

```bash
npm run db:push
```

## Paso 6: Compilar y Desplegar

```bash
npm run build
npm start
```

## Paso 7: Acceder a la Aplicación

Bolt.new te proporcionará una URL como:

```
https://tu-proyecto-xxxxx.bolt.new
```

Accede a esa URL en tu navegador.

## Configuración Avanzada

### Usar Dominio Personalizado

1. En Bolt.new, ve a "Settings" → "Domains"
2. Añade tu dominio personalizado
3. Configura los registros DNS según las instrucciones
4. Actualiza `APP_URL` en las variables de entorno

### Configurar GitHub Actions para CI/CD

Crea `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Bolt.new

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - run: npm run db:push
```

## Solución de Problemas

### Error: "Cannot find module"

```bash
npm install
npm run build
```

### Error: "Database connection refused"

1. Verifica que `DATABASE_URL` es correcto
2. Comprueba que la base de datos está en línea
3. Verifica los firewall/grupos de seguridad

### La aplicación no inicia

1. Revisa los logs en Bolt.new
2. Verifica que todas las variables de entorno están configuradas
3. Intenta compilar localmente para identificar errores

### Rendimiento lento

1. Optimiza las consultas a la base de datos
2. Usa caché donde sea posible
3. Considera actualizar el plan de Bolt.new

## Limitaciones de Bolt.new

- Almacenamiento limitado (generalmente 1GB)
- Memoria limitada
- No ideal para aplicaciones con mucho tráfico
- Mejor para desarrollo y prototipado

Para producción con mucho tráfico, considera:
- Vercel
- Netlify
- Railway
- Render

## Próximos Pasos

1. Configura backups automáticos de la base de datos
2. Implementa monitoreo y alertas
3. Configura un dominio personalizado
4. Añade autenticación OAuth

## Soporte

Para problemas específicos de Bolt.new, consulta su documentación oficial.

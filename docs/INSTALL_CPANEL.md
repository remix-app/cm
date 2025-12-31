# Instalación en cPanel - Community Manager Pro v2.0

Esta guía te ayudará a desplegar Community Manager Pro en un servidor con cPanel.

## Requisitos Previos

- Acceso a cPanel
- Node.js 18+ instalado en el servidor
- MySQL 8.0+ disponible
- Dominio o subdominio configurado

## Paso 1: Preparar el Servidor

### 1.1 Conectarse por SSH

```bash
ssh usuario@tu-dominio.com
```

### 1.2 Crear directorio del proyecto

```bash
mkdir -p ~/public_html/community-manager
cd ~/public_html/community-manager
```

## Paso 2: Descargar y Configurar el Proyecto

### 2.1 Clonar o descargar el proyecto

```bash
# Opción 1: Si tienes acceso a Git
git clone tu-repositorio .

# Opción 2: Si tienes el archivo comprimido
unzip community-manager-pro.zip
```

### 2.2 Instalar dependencias

```bash
npm install
```

## Paso 3: Configurar la Base de Datos

### 3.1 Crear base de datos en cPanel

1. Accede a cPanel
2. Ve a "MySQL Databases"
3. Crea una nueva base de datos: `usuario_community_manager`
4. Crea un usuario: `usuario_cm_user`
5. Asigna todos los privilegios al usuario
6. Anota las credenciales

### 3.2 Configurar variables de entorno

```bash
cp .env.example .env
nano .env
```

Actualiza estos valores:

```env
DATABASE_URL=mysql://usuario_cm_user:password@localhost:3306/usuario_community_manager
PORT=3000
NODE_ENV=production
JWT_SECRET=tu-secreto-super-seguro-minimo-32-caracteres
APP_URL=https://tu-dominio.com
```

### 3.3 Migrar la base de datos

```bash
npm run db:push
```

## Paso 4: Compilar para Producción

```bash
npm run build
```

## Paso 5: Configurar Node.js en cPanel

### 5.1 Usar Node.js Selector

1. Accede a cPanel
2. Ve a "Setup Node.js App"
3. Haz clic en "Create Application"
4. Configura:
   - **Node.js version**: 18.x o superior
   - **Application mode**: Production
   - **Application root**: `/home/usuario/public_html/community-manager`
   - **Application URL**: tu-dominio.com
   - **Application startup file**: `dist/index.js`

### 5.2 Configurar variables de entorno en cPanel

En la interfaz de Node.js App:
1. Haz clic en "Edit"
2. Añade las variables de entorno desde tu archivo `.env`
3. Guarda los cambios

## Paso 6: Configurar Proxy Inverso (Apache)

Edita el archivo `.htaccess` en `~/public_html/community-manager`:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteRule ^(.*)$ http://localhost:3000/$1 [P,L]
  RewriteRule ^$ http://localhost:3000/ [P,L]
</IfModule>
```

## Paso 7: Configurar SSL

1. Accede a cPanel
2. Ve a "AutoSSL" o "SSL/TLS"
3. Instala un certificado SSL gratuito (Let's Encrypt)
4. Asegúrate de que `APP_URL` en `.env` use `https://`

## Paso 8: Iniciar la Aplicación

### Opción 1: Usar cPanel Node.js Manager

1. Ve a "Setup Node.js App"
2. Selecciona tu aplicación
3. Haz clic en "Start"

### Opción 2: Iniciar manualmente por SSH

```bash
cd ~/public_html/community-manager
npm start
```

## Verificación

Accede a tu dominio en el navegador: `https://tu-dominio.com`

Deberías ver la aplicación cargando. Si hay problemas:

1. Revisa los logs en cPanel: "Error Log"
2. Verifica que el puerto 3000 esté disponible
3. Comprueba que la base de datos está accesible

## Solución de Problemas

### Error: "Cannot find module"

```bash
npm install
npm run build
```

### Error: "Database connection failed"

Verifica que `DATABASE_URL` es correcto:

```bash
mysql -u usuario_cm_user -p -h localhost usuario_community_manager
```

### La aplicación no responde

Reinicia la aplicación desde cPanel Node.js Manager o:

```bash
npm stop
npm start
```

### Logs de Error

Accede a los logs en cPanel:

1. Ve a "Error Log"
2. Busca errores relacionados con tu dominio
3. Verifica también los logs de Node.js

## Mantenimiento

### Actualizar la aplicación

```bash
cd ~/public_html/community-manager
git pull  # Si usas Git
npm install
npm run build
npm restart  # En cPanel Node.js Manager
```

### Respaldar la base de datos

```bash
mysqldump -u usuario_cm_user -p usuario_community_manager > backup.sql
```

## Soporte

Para más ayuda, consulta la documentación oficial o contacta al soporte de tu proveedor de hosting.

# Guía de Seguridad - Community Manager Pro v2.0

Esta guía proporciona las mejores prácticas de seguridad para Community Manager Pro.

## Variables de Entorno Críticas

### JWT_SECRET

**Importancia**: CRÍTICA

Debe ser una cadena aleatoria de al menos 32 caracteres. Genera una segura:

```bash
# Linux/Mac
openssl rand -base64 32

# Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object {Get-Random -Maximum 256}))
```

Ejemplo seguro:

```env
JWT_SECRET=aB3cD4eF5gH6iJ7kL8mN9oP0qR1sT2uV3wX4yZ5aB6cD7eF8gH9iJ0kL1mN2oP3qR4
```

### DATABASE_URL

**Importancia**: CRÍTICA

Nunca compartas esta URL públicamente. Usa credenciales fuertes:

```env
# ✅ CORRECTO
DATABASE_URL=mysql://cm_user:SuperSecurePassword123!@db.example.com:3306/community_manager

# ❌ INCORRECTO
DATABASE_URL=mysql://root:123456@localhost:3306/database
```

### APP_URL

**Importancia**: ALTA

Debe ser la URL HTTPS de tu aplicación:

```env
# ✅ CORRECTO
APP_URL=https://app.tu-dominio.com

# ❌ INCORRECTO
APP_URL=http://localhost:3000
```

## Configuración de Seguridad

### CORS (Cross-Origin Resource Sharing)

El proyecto está configurado para aceptar solicitudes solo desde `APP_URL`:

```typescript
app.use(cors({
  origin: process.env.APP_URL || 'http://localhost:3000',
  credentials: true,
}))
```

Para múltiples orígenes, actualiza `server/_core/index.ts`:

```typescript
const allowedOrigins = [
  'https://app.tu-dominio.com',
  'https://admin.tu-dominio.com',
]

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
}))
```

### Rate Limiting

El proyecto incluye rate limiting para prevenir ataques:

```typescript
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutos
  max: 100,                   // 100 solicitudes por ventana
  message: 'Demasiadas solicitudes',
})

app.use(limiter)
```

Para endpoints específicos más restrictivos:

```typescript
const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,  // 5 solicitudes
})

app.post('/api/login', strictLimiter, (req, res) => {
  // Lógica de login
})
```

### Helmet.js

Helmet configura headers HTTP de seguridad:

```typescript
app.use(helmet())
```

Esto incluye:
- Content Security Policy (CSP)
- X-Frame-Options
- X-Content-Type-Options
- Strict-Transport-Security

## Validación de Entrada

### Usar Zod para Validación

Siempre valida inputs del usuario:

```typescript
import { z } from 'zod'

const userSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
  name: z.string().min(2).max(100),
})

// En tu endpoint
app.post('/api/register', (req, res) => {
  const result = userSchema.safeParse(req.body)
  
  if (!result.success) {
    return res.status(400).json({ error: result.error })
  }
  
  // Procesar datos validados
})
```

### Sanitizar Salida

Previene XSS (Cross-Site Scripting):

```typescript
import DOMPurify from 'isomorphic-dompurify'

const cleanHTML = DOMPurify.sanitize(userInput)
```

## Autenticación y Autorización

### JWT (JSON Web Tokens)

El proyecto usa JWT para autenticación:

```typescript
import { SignJWT, jwtVerify } from 'jose'

const secret = new TextEncoder().encode(process.env.JWT_SECRET!)

// Crear token
const token = await new SignJWT({ userId: 123 })
  .setProtectedHeader({ alg: 'HS256' })
  .setExpirationTime('24h')
  .sign(secret)

// Verificar token
const verified = await jwtVerify(token, secret)
```

### Expiración de Tokens

Siempre configura expiración:

```typescript
.setExpirationTime('24h')  // Expira en 24 horas
```

Para tokens de refresco (refresh tokens):

```typescript
// Access token: 15 minutos
const accessToken = await new SignJWT(payload)
  .setExpirationTime('15m')
  .sign(secret)

// Refresh token: 7 días
const refreshToken = await new SignJWT(payload)
  .setExpirationTime('7d')
  .sign(secret)
```

## Base de Datos

### Prevenir SQL Injection

Usa siempre Drizzle ORM (no concatenes strings):

```typescript
// ✅ CORRECTO - Drizzle ORM
const users = await db
  .select()
  .from(usersTable)
  .where(eq(usersTable.email, userEmail))

// ❌ INCORRECTO - SQL Injection
const users = await db.query(`
  SELECT * FROM users WHERE email = '${userEmail}'
`)
```

### Encriptar Datos Sensibles

Para contraseñas, usa bcrypt:

```typescript
import bcrypt from 'bcrypt'

// Hashear contraseña
const hashedPassword = await bcrypt.hash(password, 10)

// Verificar contraseña
const isValid = await bcrypt.compare(password, hashedPassword)
```

Para datos sensibles en la BD:

```typescript
import crypto from 'crypto'

function encryptData(data: string, key: string): string {
  const cipher = crypto.createCipher('aes-256-cbc', key)
  return cipher.update(data, 'utf8', 'hex') + cipher.final('hex')
}

function decryptData(encrypted: string, key: string): string {
  const decipher = crypto.createDecipher('aes-256-cbc', key)
  return decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8')
}
```

## HTTPS/SSL

### Certificados SSL

Siempre usa HTTPS en producción:

```env
APP_URL=https://tu-dominio.com
```

Obtén certificados gratuitos:
- Let's Encrypt (recomendado)
- Cloudflare
- AWS Certificate Manager

### Forzar HTTPS

En Express:

```typescript
app.use((req, res, next) => {
  if (req.header('x-forwarded-proto') !== 'https') {
    res.redirect(`https://${req.header('host')}${req.url}`)
  } else {
    next()
  }
})
```

## Logging y Monitoreo

### Registrar Eventos de Seguridad

```typescript
import winston from 'winston'

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
})

// Registrar intentos fallidos
logger.warn('Failed login attempt', { email, ip: req.ip })
```

### Monitorear Actividad Sospechosa

```typescript
// Detectar múltiples intentos fallidos
const failedAttempts = new Map<string, number>()

app.post('/api/login', (req, res) => {
  const ip = req.ip
  const attempts = failedAttempts.get(ip) || 0
  
  if (attempts > 5) {
    logger.error('Too many failed login attempts', { ip })
    return res.status(429).json({ error: 'Too many attempts' })
  }
  
  // Lógica de login...
})
```

## Dependencias

### Mantener Dependencias Actualizadas

```bash
# Verificar vulnerabilidades
npm audit

# Actualizar dependencias
npm update

# Actualizar a versiones mayores
npm upgrade
```

### Revisar Dependencias Regularmente

```bash
# Ver dependencias desactualizadas
npm outdated
```

## Backup y Recuperación

### Backup Regular de la Base de Datos

```bash
# Backup diario
mysqldump -u usuario -p database > backup-$(date +%Y%m%d).sql

# Restaurar
mysql -u usuario -p database < backup-20240101.sql
```

### Backup de Archivos

```bash
# Comprimir proyecto
tar -czf backup-$(date +%Y%m%d).tar.gz /ruta/al/proyecto
```

## Checklist de Seguridad

- [ ] JWT_SECRET es fuerte (32+ caracteres aleatorios)
- [ ] DATABASE_URL usa credenciales fuertes
- [ ] APP_URL es HTTPS
- [ ] CORS está configurado correctamente
- [ ] Rate limiting está habilitado
- [ ] Helmet.js está configurado
- [ ] Todas las entradas se validan con Zod
- [ ] Las contraseñas se hashean con bcrypt
- [ ] Los datos sensibles se encriptan
- [ ] HTTPS está forzado
- [ ] Los logs de seguridad se registran
- [ ] Las dependencias se actualizan regularmente
- [ ] Los backups se hacen regularmente
- [ ] Se revisan los logs de error regularmente
- [ ] Se monitorea la actividad sospechosa

## Incidentes de Seguridad

Si sospechas una brecha de seguridad:

1. **Cambiar inmediatamente**:
   - JWT_SECRET
   - Contraseñas de base de datos
   - Claves API

2. **Revisar logs**:
   - Buscar acceso no autorizado
   - Identificar el alcance del incidente

3. **Notificar a usuarios** (si es necesario)

4. **Actualizar documentación** con lecciones aprendidas

## Recursos Adicionales

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Express Security](https://expressjs.com/en/advanced/best-practice-security.html)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

## Soporte de Seguridad

Para reportar vulnerabilidades, contacta al equipo de desarrollo sin publicar detalles públicamente.

# Community Manager Pro v2.0

Sistema de gestión integral de comunidades y edificios con autenticación, base de datos y API tRPC.

## Características

- ✅ Gestión de comunidades y propiedades
- ✅ Control de gastos comunes y pagos
- ✅ Sistema de autenticación con JWT
- ✅ API tRPC type-safe
- ✅ Base de datos MySQL con Drizzle ORM
- ✅ Frontend React con Tailwind CSS
- ✅ PWA ready
- ✅ Seguridad mejorada (Helmet, CORS, Rate Limiting)

## Requisitos

- Node.js 18+
- npm o pnpm
- MySQL 8.0+

## Instalación Rápida

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus valores

# 3. Migrar base de datos
npm run db:push

# 4. Iniciar desarrollo
npm run dev
```

## Scripts Disponibles

- `npm run dev` - Iniciar servidor y cliente en desarrollo
- `npm run build` - Compilar para producción
- `npm run start` - Ejecutar en producción
- `npm run check` - Verificar tipos TypeScript
- `npm run lint` - Ejecutar linter
- `npm run test` - Ejecutar tests
- `npm run db:push` - Migrar base de datos

## Estructura del Proyecto

```
├── client/          # Frontend React
├── server/          # Backend Express + tRPC
├── shared/          # Tipos compartidos
├── drizzle/         # Esquema y migraciones
└── public/          # Archivos estáticos
```

## Variables de Entorno

Ver `.env.example` para la lista completa.

## Despliegue

Ver `docs/deployment.md` para instrucciones de despliegue en diferentes plataformas.

## Licencia

MIT

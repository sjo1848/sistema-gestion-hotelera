# Sistema de Gestión Hotelera (PMS)

PMS para operación hotelera con backend NestJS + Prisma + Postgres y frontend Vue + Pinia + Tailwind.

## Stack
- Backend: NestJS, Prisma, PostgreSQL
- Frontend: Vue 3, Pinia, Tailwind
- Infra: Docker Compose

## Requisitos
- Docker + Docker Compose
- Node 20+ (solo si corres fuera de Docker)

## Inicio rápido (Docker)
```bash
docker-compose up --build
```

Backend: `http://localhost:3000/api/v1`  
Frontend: `http://localhost:5173`

## Deploy (básico)
Imágenes de producción:
- Backend: `backend/Dockerfile.prod`
- Frontend: `frontend/Dockerfile.prod`

Ejemplo build:
```bash
docker build -f backend/Dockerfile.prod -t hotel-backend:prod ./backend
docker build -f frontend/Dockerfile.prod -t hotel-frontend:prod ./frontend
```

## Archivo .env ejemplo
Usa `.env.example` como base para producción.

## Variables de entorno
Archivo raíz `.env`:
```
DB_USER=admin_hotel
DB_PASSWORD=palo_alto_secure_2026
DB_NAME=hotel_pms_dev
DATABASE_URL="postgresql://admin_hotel:palo_alto_secure_2026@postgres_db:5432/hotel_pms_dev?schema=public"
JWT_SECRET=super_secret_key_hotel_2026
BACKEND_PORT=3000
FRONTEND_PORT=5173
```

## Seed de datos
```bash
docker-compose exec backend npx prisma db seed
```

Credenciales seed:
- Admin: `admin@paloalto.com` / `admin_password_123`
- Staff: `staff@paloalto.com` / `staff_password_123`

## Tests E2E
```bash
docker-compose exec backend npm run test:e2e
```

## API
Documentación:
- `API.md`
- `API.txt`

Prefijo obligatorio: `/api/v1`

## Desarrollo sin Docker (opcional)
Backend:
```bash
cd backend
npm install
npx prisma generate
npm run start:dev
```

Frontend:
```bash
cd frontend
npm install
npm run dev
```

## Notas de seguridad
- JWT expira en 12 horas.
- Passwords con bcrypt cost 10.
- TODO: Migrar JWT a HttpOnly cookies + refresh token para producción.

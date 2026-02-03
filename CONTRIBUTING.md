# Contribuir

Gracias por contribuir al sistema de gestión hotelera.

## Flujo de trabajo
1. Crea una rama desde `main`:
   - `feat/`, `fix/`, `chore/`
2. Abre un PR usando el template.
3. Asegura tests y lint si aplica.

## Estándares de código
- Evitar lógica duplicada en servicios.
- DTOs alineados con Prisma.
- Prefijo `/api/v1` obligatorio.

## Tests
```bash
docker-compose exec backend npm run test:e2e
```

## Commits
Usa mensajes claros:
- `feat: ...`
- `fix: ...`
- `chore: ...`
- `docs: ...`

## Seguridad
- No subir secretos reales.
- Mantener `.env` fuera del repo público si contiene credenciales reales.

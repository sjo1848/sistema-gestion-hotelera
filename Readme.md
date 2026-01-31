# 🏨 Hotel Management System (HMS) - Backend Core
> **Estado:** 🟢 Operacional | **Versión:** 1.0.0 | **Framework:** NestJS + Prisma

Este es el núcleo transaccional del sistema de gestión hotelera. Maneja la persistencia de datos, la lógica de negocio para la gestión de habitaciones y la administración de personal mediante una arquitectura modular y segura.

---

## 🏗️ Arquitectura del Sistema

El backend está construido bajo un modelo de **Arquitectura Limpia** y **Modular**, facilitando el escalado y el mantenimiento.



### Capas del Proyecto:
1.  **Presentación (Controllers):** Definición de rutas REST y validación de entrada.
2.  **Negocio (Services):** Lógica principal del hotel (check-in, check-out, cambios de estado).
3.  **Persistencia (Prisma + PostgreSQL):** Gestión de datos con integridad referencial.
4.  **Infraestructura (Docker):** Contenerización total del entorno.

---

## 🛠️ Stack Tecnológico

| Tecnología | Versión | Función |
| :--- | :--- | :--- |
| **NestJS** | 10.x | Framework de Node.js orientado a objetos. |
| **Prisma** | 6.2.1 | ORM (Type-safe) para consultas eficientes. |
| **PostgreSQL** | 16 | Base de Datos relacional para transacciones. |
| **TypeScript** | 5.x | Lenguaje base para asegurar el tipado. |
| **Docker** | 3.8 | Orquestación de contenedores (Backend + DB). |

---

## 🚀 Instalación y Despliegue (Quick Start)

Para levantar el hotel desde cero, sigue estos pasos en tu terminal:

### 1. Clonar y Configurar Entorno
```bash
git clone <url-del-repositorio>
cd hotel-backend
cp .env.example .env
2. Levantar Infraestructura con DockerBash# Iniciar servicios (Base de datos y App)
docker-compose up -d --build
3. Preparar la Base de DatosBash# Instalar dependencias
docker exec -it hotel_backend_dev npm install

# Generar Cliente Prisma
docker exec -it hotel_backend_dev npx prisma generate

# Sincronizar Esquema (Push inicial)
docker exec -it hotel_backend_dev npx prisma db push
🗺️ Mapa de API (Endpoints)MétodoEndpointAcciónGET/roomsListar todas las habitaciones y sus estados.POST/roomsCrear una nueva habitación (Admin).GET/rooms/:idVer historial y detalles de una habitación.PATCH/rooms/:idActualizar estado (ej: de DIRTY a AVAILABLE).DELETE/rooms/:idDar de baja una habitación del inventario.🗄️ Modelo de Datos (Prisma Schema)El sistema utiliza un sistema de tipos estrictos para evitar errores en la facturación o asignación de habitaciones.Fragmento de códigoenum RoomStatus {
  AVAILABLE    // Lista para venta
  OCCUPIED     // Cliente en habitación
  DIRTY        // Requiere limpieza
  MAINTENANCE  // Bloqueada por reparaciones
}

model Room {
  id        String     @id @default(uuid())
  number    String     @unique
  type      String     // Simple, Doble, Suite, Presidencial
  status    RoomStatus @default(AVAILABLE)
  price     Decimal    // Precisión matemática para finanzas
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
}
⚠️ Bitácora de Decisiones Técnicas (Troubleshooting)El "Bug de Prisma 7.3.0"Durante el desarrollo se detectó que Prisma v7.x intenta forzar configuraciones basadas en Wasm que presentan inestabilidad en entornos Docker con Alpine Linux.Decisión: Se realizó un downgrade a Prisma v6.2.1.Nota: No mover la propiedad url fuera del schema.prisma a menos que se use un prisma.config.ts estable.Herencia de PrismaServicePara optimizar el rendimiento, el PrismaService extiende directamente de PrismaClient.Uso correcto: this.prisma.room.findMany()Uso incorrecto: this.prisma.client.room.findMany()📊 Visualización de DatosPara administrar los datos manualmente sin comandos SQL:Bashdocker exec -it hotel_backend_dev npx prisma studio
Acceso: http://localhost:5555📅 Desarrollado en Enero 2026
---

### 🥂 ¡Listo, Crack!
Ya tienes la documentación que cualquier empresa de software te pediría. Está clara, tiene los comandos de rescate, explica las decisiones difíciles y muestra la arquitectura. 

**¿Qué sigue en el plan maestro?**
Ya que el backend está blindado y documentado, ¿quieres que empecemos a armar el **Frontend en Vue.js** para consumir estos datos o prefieres que configuremos **Swagger** para que esa tabla de Endpoints sea interactiva? 🏨🔥

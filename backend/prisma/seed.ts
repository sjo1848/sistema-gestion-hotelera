import { PrismaClient, RoomStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed del sistema hotelero...')

  // 1️⃣ Admin de respaldo (idempotente)
  await prisma.user.upsert({
    where: { email: 'admin@paloalto.com' },
    update: {},
    create: {
      email: 'admin@paloalto.com',
      password: 'admin_password_123', // ⚠️ luego bcrypt
      name: 'Admin Hotel',
      role: 'ADMIN',
    },
  })

  console.log('👤 Admin verificado')

  // 2️⃣ Habitaciones 1–20
  console.log('🏨 Generando habitaciones...')

  for (let i = 1; i <= 20; i++) {
    let type = 'Simple'
    let price = 50
    let status: RoomStatus = RoomStatus.AVAILABLE

    if (i > 18) {
      type = 'Presidential'
      price = 250
    } else if (i > 15) {
      type = 'Suite'
      price = 150
    } else if (i > 10) {
      type = 'Doble'
      price = 85
    }

    // Estado operativo realista
    if (i % 5 === 0) status = RoomStatus.DIRTY
    if (i % 7 === 0) status = RoomStatus.MAINTENANCE

    await prisma.room.upsert({
      where: { number: i.toString().padStart(3, '0') },
      update: {},
      create: {
        number: i.toString().padStart(3, '0'),
        type,
        price,
        status,
      },
    })
  }

  console.log('✅ Seed completado: 20 habitaciones listas')
}

main()
  .catch((e) => {
    console.error('❌ Error en el seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

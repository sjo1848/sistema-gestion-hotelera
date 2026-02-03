import { PrismaClient, RoomStatus } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed del sistema hotelero...')

  // 1️⃣ Admin de respaldo (idempotente)
  const hashedAdminPassword = await bcrypt.hash('admin_password_123', 10)

  await prisma.user.upsert({
    where: { email: 'admin@paloalto.com' },
    update: {
      password: hashedAdminPassword,
      name: 'Admin Hotel',
      role: 'ADMIN',
    },
    create: {
      email: 'admin@paloalto.com',
      password: hashedAdminPassword,
      name: 'Admin Hotel',
      role: 'ADMIN',
    },
  })

  console.log('👤 Admin verificado')

  // 1️⃣ Staff de respaldo (idempotente)
  const hashedStaffPassword = await bcrypt.hash('staff_password_123', 10)

  await prisma.user.upsert({
    where: { email: 'staff@paloalto.com' },
    update: {
      password: hashedStaffPassword,
      name: 'Staff Hotel',
      role: 'STAFF',
    },
    create: {
      email: 'staff@paloalto.com',
      password: hashedStaffPassword,
      name: 'Staff Hotel',
      role: 'STAFF',
    },
  })

  console.log('👤 Staff verificado')

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

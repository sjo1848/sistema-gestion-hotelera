import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { RoomStatus } from '@prisma/client'
import { CreateRoomDto } from './dto/create-room.dto'



@Injectable()
export class RoomsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.room.findMany({
      orderBy: { number: 'asc' },
    })
  }

  async findOne(id: string) {
    const room = await this.prisma.room.findUnique({
      where: { id },
    })

    if (!room) {
      throw new NotFoundException('Habitación no encontrada')
    }

    return room
  }

  async create(data: CreateRoomDto) {
  // Validar que no exista el número de habitación
  const existing = await this.prisma.room.findUnique({
    where: { number: data.number },
  })

  if (existing) {
    throw new BadRequestException(
      `La habitación ${data.number} ya existe`,
    )
  }

  return this.prisma.room.create({
    data: {
      number: data.number,
      type: data.type,
      price: data.price,
      status: data.status ?? RoomStatus.AVAILABLE,
    },
  })
}

  async remove(id: string) {
    await this.findOne(id)
    return this.prisma.room.delete({
      where: { id },
    })
  }

  async updateStatus(roomId: string, newStatus: RoomStatus) {
    const room = await this.findOne(roomId)

    const allowedTransitions: Record<RoomStatus, RoomStatus[]> = {
      AVAILABLE: [RoomStatus.OCCUPIED, RoomStatus.MAINTENANCE],
      OCCUPIED: [RoomStatus.DIRTY],
      DIRTY: [RoomStatus.AVAILABLE, RoomStatus.MAINTENANCE],
      MAINTENANCE: [RoomStatus.AVAILABLE],
    }

    if (!allowedTransitions[room.status]?.includes(newStatus)) {
      throw new BadRequestException(
        `Transición inválida: ${room.status} → ${newStatus}`,
      )
    }

    return this.prisma.room.update({
      where: { id: roomId },
      data: { status: newStatus },
    })
  }
}

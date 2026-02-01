import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { RoomStatus } from '@prisma/client'

@Injectable()
export class StaysService {
  constructor(private readonly prisma: PrismaService) {}

  async checkIn(roomId: string, guestName: string) {
    return this.prisma.$transaction(async (tx) => {
      const room = await tx.room.findUnique({
        where: { id: roomId },
      })

      if (!room) {
        throw new NotFoundException('Habitación no encontrada')
      }

      if (room.status !== RoomStatus.AVAILABLE) {
        throw new BadRequestException(
          'La habitación no está disponible',
        )
      }

      const activeStay = await tx.stay.findFirst({
        where: { roomId, checkOutAt: null },
      })

      if (activeStay) {
        throw new BadRequestException(
          'La habitación ya tiene una estadía activa',
        )
      }

      const stay = await tx.stay.create({
        data: { roomId, guestName },
      })

      await tx.room.update({
        where: { id: roomId },
        data: { status: RoomStatus.OCCUPIED },
      })

      return stay
    })
  }
}

import {
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RoomStatus } from '@prisma/client';

@Injectable()
export class StaysService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Check-in is handled atomically via a database transaction.
   *
   * Business invariants:
   * - A room can have only ONE active stay at a time
   * - A stay with checkOutAt = null is considered active
   * - Room status must be AVAILABLE to allow check-in
   *
   * This logic is intentionally centralized in the Stay aggregate.
   */
  async checkIn(
    roomId: string,
    guestName: string,
    checkInAt: Date,
  ) {
    return this.prisma.$transaction(async (tx) => {

      // 1️⃣ Room must exist
      const room = await tx.room.findUnique({
        where: { id: roomId },
      });

      if (!room) {
        throw new NotFoundException('Room not found');
      }

      if (room.status !== RoomStatus.AVAILABLE) {
        throw new ConflictException('Room is not available');
      }

      // 2️⃣ Ensure no active stay exists for this room
      const activeStay = await tx.stay.findFirst({
        where: {
          roomId,
          checkOutAt: null,
        },
      });

      if (activeStay) {
        throw new ConflictException(
          'There is already an active stay for this room',
        );
      }

      // 3️⃣ Create stay (atomic)
      const stay = await tx.stay.create({
        data: {
          room: {
            connect: { id: roomId },
          },
          guestName,
          checkInAt,
        },
      });

      // 4️⃣ Update room status
      await tx.room.update({
        where: { id: roomId },
        data: { status: RoomStatus.OCCUPIED },
      });

      return stay;
    });
  }

  /**
   * Check-out is handled atomically via a database transaction.
   *
   * Business invariants:
   * - A room must be OCCUPIED to allow check-out
   * - There must be exactly ONE active stay (checkOutAt = null)
   */
  async checkOut(
    roomId: string,
    checkOutAt: Date,
  ) {
    return this.prisma.$transaction(async (tx) => {
      // 1️⃣ Room must exist
      const room = await tx.room.findUnique({
        where: { id: roomId },
      });

      if (!room) {
        throw new NotFoundException('Room not found');
      }

      if (room.status !== RoomStatus.OCCUPIED) {
        throw new ConflictException('Room is not occupied');
      }

      // 2️⃣ Find active stay
      const activeStay = await tx.stay.findFirst({
        where: {
          roomId,
          checkOutAt: null,
        },
      });

      if (!activeStay) {
        throw new ConflictException(
          'No active stay found for this room',
        );
      }

      // 3️⃣ Close stay
      const stay = await tx.stay.update({
        where: { id: activeStay.id },
        data: { checkOutAt },
      });

      // 4️⃣ Update room status
      await tx.room.update({
        where: { id: roomId },
        data: { status: RoomStatus.DIRTY },
      });

      return stay;
    });
  }
}

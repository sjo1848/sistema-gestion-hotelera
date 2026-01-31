import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule], // <-- ¡ESTO ES VITAL!
  controllers: [RoomsController],
  providers: [RoomsService],
})
export class RoomsModule {}

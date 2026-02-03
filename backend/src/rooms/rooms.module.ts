import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { StaysModule } from '../stays/stays.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, StaysModule, AuthModule], // <-- ¡ESTO ES VITAL!
  controllers: [RoomsController],
  providers: [RoomsService],
})
export class RoomsModule {}

import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Esto hace que Prisma esté disponible en toda la app sin importarlo 20 veces
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}

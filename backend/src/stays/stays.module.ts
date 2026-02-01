import { Module } from '@nestjs/common'
import { StaysService } from './stays.service'
import { StaysController } from './stays.controller'
import { PrismaModule } from '../prisma/prisma.module'

@Module({
  imports: [PrismaModule],
  providers: [StaysService],
  controllers: [StaysController],
})
export class StaysModule {}

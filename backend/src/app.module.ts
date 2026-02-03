import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { PrismaModule } from './prisma/prisma.module'
import { RoomsModule } from './rooms/rooms.module'
import { StaysModule } from './stays/stays.module'
import { AuthModule } from './auth/auth.module'

@Module({
  imports: [
    PrismaModule,
    RoomsModule,
    StaysModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

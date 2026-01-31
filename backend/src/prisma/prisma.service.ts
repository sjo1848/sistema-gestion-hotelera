import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    try {
      await this.$connect();
      console.log('✅ [DATABASE] Sistema de Hotel conectado exitosamente');
    } catch (error) {
      console.error('❌ [DATABASE] Error al conectar:', error.message);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}

import { Module } from '@nestjs/common';
import { PublicacionController } from './publicacion.controller';

@Module({
  controllers: [PublicacionController]
})
export class PublicacionModule {}

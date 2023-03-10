import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublicacionController } from './publicacion.controller';
import { PublicacionEntity } from './publicacion.entity';
import { PublicacionService } from './publicacion.service';

@Module({
  providers: [PublicacionService],
  imports: [TypeOrmModule.forFeature([PublicacionEntity])],
  controllers: [PublicacionController]
})
export class PublicacionModule {}

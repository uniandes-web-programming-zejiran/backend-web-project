import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NegocioEntity } from './negocio.entity';
import { NegocioService } from './negocio.service';
import { NegocioController } from './negocio.controller';

@Module({
  providers: [NegocioService],
  imports: [TypeOrmModule.forFeature([NegocioEntity])],
  controllers: [NegocioController],
})
export class NegocioModule {}

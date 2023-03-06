import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NegocioEntity } from './negocio.entity';
import { NegocioService } from './negocio.service';

@Module({
  providers: [NegocioService],
  imports: [TypeOrmModule.forFeature([NegocioEntity])],
})
export class NegocioModule {}

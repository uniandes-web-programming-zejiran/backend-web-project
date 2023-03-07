import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NegocioEntity } from 'src/negocio/negocio.entity';
import { EventoEntity } from 'src/evento/evento.entity';
import { NegocioEventoService } from './negocio-evento.service';

@Module({
  providers: [NegocioEventoService],
  imports: [TypeOrmModule.forFeature([NegocioEntity, EventoEntity])],
})
export class NegocioEventoModule {}

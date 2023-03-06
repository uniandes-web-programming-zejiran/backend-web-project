import { Module } from '@nestjs/common';
import { NegocioEventoService } from './negocio-evento.service';

@Module({
  providers: [NegocioEventoService]
})
export class NegocioEventoModule {}

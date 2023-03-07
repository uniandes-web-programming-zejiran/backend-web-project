import { Module } from '@nestjs/common';
import { EventoEntity } from './evento.entity';
import { EventoService } from './evento.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([EventoEntity])],
  providers: [EventoService],
})
export class EventoModule {}

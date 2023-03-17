import { Module } from '@nestjs/common';
import { EventoEntity } from './evento.entity';
import { EventoService } from './evento.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventoController } from './evento.controller';

@Module({
  imports: [TypeOrmModule.forFeature([EventoEntity])],
  providers: [EventoService],
  controllers: [EventoController],
})
export class EventoModule {}

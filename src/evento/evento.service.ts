import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { EventoEntity } from './evento.entity';

@Injectable()
export class EventoService {
  constructor(
    @InjectRepository(EventoEntity)
    private readonly eventoRepository: Repository<EventoEntity>,
  ) {}

  async findAll(): Promise<EventoEntity[]> {
    return await this.eventoRepository.find({
      relations: [],
    });
  }

  async findOne(id: string): Promise<EventoEntity> {
    const evento: EventoEntity = await this.eventoRepository.findOne({
      where: { id },
      relations: [],
    });
    if (!evento)
      throw new BusinessLogicException(
        'The event with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    return evento;
  }

  async create(evento: EventoEntity): Promise<EventoEntity> {
    return await this.eventoRepository.save(evento);
  }

  async update(id: string, evento: EventoEntity): Promise<EventoEntity> {
    const persistedEvento: EventoEntity = await this.eventoRepository.findOne({
      where: { id },
    });
    if (!persistedEvento)
      throw new BusinessLogicException(
        'The event with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    evento.id = id;

    return await this.eventoRepository.save({
      ...persistedEvento,
      ...evento,
    });
  }

  async delete(id: string): Promise<void> {
    const evento: EventoEntity = await this.eventoRepository.findOne({
      where: { id },
    });
    if (!evento)
      throw new BusinessLogicException(
        'The event with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    await this.eventoRepository.remove(evento);
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { NegocioEntity } from './negocio.entity';

@Injectable()
export class NegocioService {
  constructor(
    @InjectRepository(NegocioEntity)
    private readonly negocioRepository: Repository<NegocioEntity>,
  ) {}

  async findAll(): Promise<NegocioEntity[]> {
    return await this.negocioRepository.find({
      relations: ['productos', 'eventos'],
    });
  }

  async findOne(id: string): Promise<NegocioEntity> {
    const negocio: NegocioEntity = await this.negocioRepository.findOne({
      where: { id },
      relations: ['productos', 'eventos'],
    });
    if (!negocio)
      throw new BusinessLogicException(
        'El negocio con el id dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );

    return negocio;
  }

  async create(negocio: NegocioEntity): Promise<NegocioEntity> {
    return await this.negocioRepository.save(negocio);
  }

  async update(id: string, negocio: NegocioEntity): Promise<NegocioEntity> {
    const persistedNegocio: NegocioEntity =
      await this.negocioRepository.findOne({ where: { id } });
    if (!persistedNegocio)
      throw new BusinessLogicException(
        'El negocio con el id dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );

    return await this.negocioRepository.save({
      ...persistedNegocio,
      ...negocio,
    });
  }

  async delete(id: string) {
    const negocio: NegocioEntity = await this.negocioRepository.findOne({
      where: { id },
    });
    if (!negocio)
      throw new BusinessLogicException(
        'El negocio con el id dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );

    await this.negocioRepository.remove(negocio);
  }
}

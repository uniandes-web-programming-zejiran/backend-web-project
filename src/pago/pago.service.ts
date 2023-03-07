import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { PagoEntity } from './pago.entity';

@Injectable()
export class PagoService {
  constructor(
    @InjectRepository(PagoEntity)
    private readonly pagoRepository: Repository<PagoEntity>,
  ) {}

  async findAll(): Promise<PagoEntity[]> {
    return await this.pagoRepository.find({
      relations: ['pedidos'],
    });
  }

  async findOne(id: string): Promise<PagoEntity> {
    const pago: PagoEntity = await this.pagoRepository.findOne({
      where: { id },
      relations: ['pedidos'],
    });
    if (!pago)
      throw new BusinessLogicException(
        'El pago con el id dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );

    return pago;
  }

  async create(pago: PagoEntity): Promise<PagoEntity> {
    return await this.pagoRepository.save(pago);
  }

  async update(id: string, pago: PagoEntity): Promise<PagoEntity> {
    const persistedPago: PagoEntity =
      await this.pagoRepository.findOne({ where: { id } });
    if (!persistedPago)
      throw new BusinessLogicException(
        'El pago con el id dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );

    return await this.pagoRepository.save({
      ...persistedPago,
      ...pago,
    });
  }

  async delete(id: string) {
    const pago: PagoEntity = await this.pagoRepository.findOne({
      where: { id },
    });
    if (!pago)
      throw new BusinessLogicException(
        'El pago con el id dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );

    await this.pagoRepository.remove(pago);
  }
}

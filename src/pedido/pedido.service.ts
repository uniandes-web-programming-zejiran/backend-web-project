import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { PedidoEntity } from './pedido.entity';

@Injectable()
export class PedidoService {
  constructor(
    @InjectRepository(PedidoEntity)
    private readonly pedidoRepository: Repository<PedidoEntity>,
  ) {}

  async findAll(): Promise<PedidoEntity[]> {
    return await this.pedidoRepository.find({
      relations: [],
    });
  }

  async findOne(id: string): Promise<PedidoEntity> {
    const pedido: PedidoEntity = await this.pedidoRepository.findOne({
      where: { id },
      relations: [],
    });
    if (!pedido)
      throw new BusinessLogicException(
        'The pedido with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    return pedido;
  }

  async create(pedido: PedidoEntity): Promise<PedidoEntity> {
    return await this.pedidoRepository.save(pedido);
  }

  async update(id: string, pedido: PedidoEntity): Promise<PedidoEntity> {
    const persistedPedido: PedidoEntity = await this.pedidoRepository.findOne({
      where: { id },
    });
    if (!persistedPedido)
      throw new BusinessLogicException(
        'The pedido with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    pedido.id = id;
    return await this.pedidoRepository.save({
      ...persistedPedido,
      ...pedido,
    });
  }

  async delete(id: string): Promise<void> {
    const pedido: PedidoEntity = await this.pedidoRepository.findOne({
      where: { id },
    });
    if (!pedido)
      throw new BusinessLogicException(
        'The pedido with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    await this.pedidoRepository.remove(pedido);
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductoEntity } from '../producto/producto.entity';
import { PedidoEntity } from '../pedido/pedido.entity';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class ProductoPedidoService {
  constructor(
    @InjectRepository(ProductoEntity)
    private readonly productoRepository: Repository<ProductoEntity>,

    @InjectRepository(PedidoEntity)
    private readonly pedidoRepository: Repository<PedidoEntity>,
  ) {}
  async addProductoPedido(
    productoId: string,
    pedidoId: string,
  ): Promise<PedidoEntity> {
    const pedido: PedidoEntity = await this.pedidoRepository.findOne({
      where: { id: pedidoId },
      relations: ['productos'],
    });
    if (!pedido)
      throw new BusinessLogicException(
        'El pedido con el id dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );

    const producto: ProductoEntity = await this.productoRepository.findOne({
      where: { id: productoId },
    });
    if (!producto)
      throw new BusinessLogicException(
        'The producto with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    pedido.productos = [...pedido.productos, producto];
    return await this.pedidoRepository.save(pedido);
  }

  async findProductoByPedidoIdProductoId(
    productoId: string,
    pedidoId: string,
  ): Promise<ProductoEntity> {
    const pedido: PedidoEntity = await this.pedidoRepository.findOne({
      where: { id: pedidoId },
      relations: ['productos'],
    });
    if (!pedido)
      throw new BusinessLogicException(
        'El pedido con el id dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );

    const producto: ProductoEntity = await this.productoRepository.findOne({
      where: { id: productoId },
    });
    if (!producto)
      throw new BusinessLogicException(
        'The producto with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const productoPedido: ProductoEntity = pedido.productos.find(
      (e) => e.id === producto.id,
    );

    if (!productoPedido)
      throw new BusinessLogicException(
        'El producto con el id dado no está asociado al pedido',
        BusinessError.PRECONDITION_FAILED,
      );

    return productoPedido;
  }

  async findProductosByPedidoId(pedidoId: string): Promise<ProductoEntity[]> {
    const pedido: PedidoEntity = await this.pedidoRepository.findOne({
      where: { id: pedidoId },
      relations: ['productos'],
    });
    if (!pedido)
      throw new BusinessLogicException(
        'El pedido con el id dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );

    return pedido.productos;
  }

  async associateProductosPedido(
    pedidoId: string,
    productos: ProductoEntity[],
  ): Promise<PedidoEntity> {
    const pedido: PedidoEntity = await this.pedidoRepository.findOne({
      where: { id: pedidoId },
      relations: ['productos'],
    });

    if (!pedido)
      throw new BusinessLogicException(
        'El pedido con el id dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );

    for (let i = 0; i < productos.length; i++) {
      const producto: ProductoEntity = await this.productoRepository.findOne({
        where: { id: productos[i].id },
      });
      if (!producto)
        throw new BusinessLogicException(
          'The producto with the given id was not found',
          BusinessError.NOT_FOUND,
        );
    }

    pedido.productos = productos;
    return await this.pedidoRepository.save(pedido);
  }

  async deleteProductoPedido(productoId: string, pedidoId: string) {
    const producto: ProductoEntity = await this.productoRepository.findOne({
      where: { id: productoId },
    });
    if (!producto)
      throw new BusinessLogicException(
        'The producto with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const pedido: PedidoEntity = await this.pedidoRepository.findOne({
      where: { id: pedidoId },
      relations: ['productos'],
    });
    if (!pedido)
      throw new BusinessLogicException(
        'El pedido con el id dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );

    const productoPedido: ProductoEntity = pedido.productos.find(
      (e) => e.id === producto.id,
    );

    if (!productoPedido)
      throw new BusinessLogicException(
        'El producto con el id dado no está asociado al pedido',
        BusinessError.PRECONDITION_FAILED,
      );
      pedido.productos = pedido.productos.filter((e) => e.id !== productoId);
    await this.pedidoRepository.save(pedido);
  }
}
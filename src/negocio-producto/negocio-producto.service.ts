import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NegocioEntity } from '../negocio/negocio.entity';
import { ProductoEntity } from '../producto/producto.entity';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class NegocioProductoService {
  constructor(
    @InjectRepository(NegocioEntity)
    private readonly negocioRepository: Repository<NegocioEntity>,

    @InjectRepository(ProductoEntity)
    private readonly productoRepository: Repository<ProductoEntity>,
  ) {}

  async addProductoNegocio(
    negocioId: string,
    productoId: string,
  ): Promise<NegocioEntity> {
    const producto: ProductoEntity = await this.productoRepository.findOne({
      where: { id: productoId },
    });
    if (!producto)
      throw new BusinessLogicException(
        'El producto con el id dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );

    const negocio: NegocioEntity = await this.negocioRepository.findOne({
      where: { id: negocioId },
      relations: ['productos', 'eventos'],
    });
    if (!negocio)
      throw new BusinessLogicException(
        'El negocio con el id dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );

    negocio.productos = [...negocio.productos, producto];
    return await this.negocioRepository.save(negocio);
  }

  async findProductoByNegocioIdProductoId(
    negocioId: string,
    productoId: string,
  ): Promise<ProductoEntity> {
    const producto: ProductoEntity = await this.productoRepository.findOne({
      where: { id: productoId },
    });
    if (!producto)
      throw new BusinessLogicException(
        'El producto con el id dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );

    const negocio: NegocioEntity = await this.negocioRepository.findOne({
      where: { id: negocioId },
      relations: ['productos', 'eventos'],
    });
    if (!negocio)
      throw new BusinessLogicException(
        'El negocio con el id dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );

    const negocioProducto: ProductoEntity = negocio.productos.find(
      (e) => e.id === producto.id,
    );

    if (!negocioProducto)
      throw new BusinessLogicException(
        'El producto con el id dado no esta asociado al negocio',
        BusinessError.PRECONDITION_FAILED,
      );

    return negocioProducto;
  }

  async findProductosByNegocioId(negocioId: string): Promise<ProductoEntity[]> {
    const negocio: NegocioEntity = await this.negocioRepository.findOne({
      where: { id: negocioId },
      relations: ['productos'],
    });
    if (!negocio)
      throw new BusinessLogicException(
        'El negocio con el id dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );

    return negocio.productos;
  }

  async associateProductosNegocio(
    negocioId: string,
    productos: ProductoEntity[],
  ): Promise<NegocioEntity> {
    const negocio: NegocioEntity = await this.negocioRepository.findOne({
      where: { id: negocioId },
      relations: ['productos'],
    });

    if (!negocio)
      throw new BusinessLogicException(
        'El negocio con el id dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );

    for (let i = 0; i < productos.length; i++) {
      const producto: ProductoEntity = await this.productoRepository.findOne({
        where: { id: productos[i].id },
      });
      if (!producto)
        throw new BusinessLogicException(
          'El producto con el id dado no fue encontrado',
          BusinessError.NOT_FOUND,
        );
    }

    negocio.productos = productos;
    return await this.negocioRepository.save(negocio);
  }

  async deleteProductoNegocio(negocioId: string, productoId: string) {
    const producto: ProductoEntity = await this.productoRepository.findOne({
      where: { id: productoId },
    });
    if (!producto)
      throw new BusinessLogicException(
        'El producto con el id dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );

    const negocio: NegocioEntity = await this.negocioRepository.findOne({
      where: { id: negocioId },
      relations: ['productos'],
    });
    if (!negocio)
      throw new BusinessLogicException(
        'El negocio con el id dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );

    const negocioProducto: ProductoEntity = negocio.productos.find(
      (e) => e.id === producto.id,
    );

    if (!negocioProducto)
      throw new BusinessLogicException(
        'El producto con el id dado no esta asociado al negocio',
        BusinessError.PRECONDITION_FAILED,
      );

    negocio.productos = negocio.productos.filter((e) => e.id !== productoId);
    await this.negocioRepository.save(negocio);
  }
}

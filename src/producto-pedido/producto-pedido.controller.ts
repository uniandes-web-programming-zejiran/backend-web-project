/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ProductoDto } from 'src/producto/producto.dto';
import { ProductoEntity } from 'src/producto/producto.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { ProductoPedidoService } from './producto-pedido.service';

@Controller('pedidos')
@UseInterceptors(BusinessErrorsInterceptor)
export class ProductoPedidoController {
  constructor(private readonly productoPedidoService: ProductoPedidoService) {}

  @Post(':pedidoId/productos/:productoId')
  async addReviewUsuario(
    @Param('pedidoId') pedidoId: string,
    @Param('productoId') productoId: string,
  ) {
    return await this.productoPedidoService.addProductoPedido(
      productoId,
      pedidoId,
    );
  }

  @Get(':pedidoId/productos/:productoId')
  async findProductoByPedidoIdProductoId(
    @Param('pedidoId') pedidoId: string,
    @Param('productoId') productoId: string,
  ) {
    return await this.productoPedidoService.findProductoByPedidoIdProductoId(
      productoId,
      pedidoId,
    );
  }

  @Get(':pedidoId/productos')
  async findProductosByPedidoId(@Param('pedidoId') pedidoId: string) {
    return await this.productoPedidoService.findProductosByPedidoId(pedidoId);
  }

  @Put(':pedidoId/productos')
  async associateProductosPedido(
    @Body() productosDto: ProductoDto[],
    @Param('pedidoId') pedidoId: string,
  ) {
    const productos = plainToInstance(ProductoEntity, productosDto);
    return await this.productoPedidoService.associateProductosPedido(
      pedidoId,
      productos,
    );
  }

  @Delete(':pedidoId/productos/:productoId')
  @HttpCode(204)
  async deleteProductoPedido(
    @Param('pedidoId') pedidoId: string,
    @Param('productoId') productoId: string,
  ) {
    return await this.productoPedidoService.deleteProductoPedido(
      productoId,
      pedidoId,
    );
  }
}

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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { RolesGuard } from '../auth/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { HasRoles } from '../auth/has-roles.decorator';
import { Role } from '../auth/role.enum';
import { ProductoDto } from 'src/producto/producto.dto';
import { ProductoEntity } from 'src/producto/producto.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { ProductoPedidoService } from './producto-pedido.service';

@Controller('pedidos')
@UseInterceptors(BusinessErrorsInterceptor)
export class ProductoPedidoController {
  constructor(private readonly productoPedidoService: ProductoPedidoService) {}

  @HasRoles(Role.AdminProducto, Role.EscrituraProducto, Role.AdminPedido, Role.EscrituraPedido)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post(':pedidoId/productos/:productoId')
  async addProductoPedido(
    @Param('pedidoId') pedidoId: string,
    @Param('productoId') productoId: string,
  ) {
    return await this.productoPedidoService.addProductoPedido(
      productoId,
      pedidoId,
    );
  }

  @HasRoles(Role.AdminProducto, Role.LecturaProducto, Role.AdminPedido, Role.LecturaPedido)
  @UseGuards(JwtAuthGuard, RolesGuard)
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

  @HasRoles(Role.AdminProducto, Role.LecturaProducto, Role.AdminPedido, Role.LecturaPedido)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':pedidoId/productos')
  async findProductosByPedidoId(@Param('pedidoId') pedidoId: string) {
    return await this.productoPedidoService.findProductosByPedidoId(pedidoId);
  }

  @HasRoles(Role.AdminProducto, Role.EscrituraProducto, Role.AdminPedido, Role.EscrituraPedido)
  @UseGuards(JwtAuthGuard, RolesGuard)
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

  @HasRoles(Role.AdminProducto, Role.EliminarProducto, Role.AdminPedido, Role.EliminarPedido)
  @UseGuards(JwtAuthGuard, RolesGuard)
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

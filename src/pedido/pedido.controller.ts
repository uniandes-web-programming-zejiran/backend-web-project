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
import { Role } from '../auth/role.enum';
import { HasRoles } from '../auth/has-roles.decorator';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { PedidoDto } from './pedido.dto';
import { PedidoEntity } from './pedido.entity';
import { PedidoService } from './pedido.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@Controller('pedidos')
@UseInterceptors(BusinessErrorsInterceptor)
export class PedidoController {
  constructor(private readonly pedidoService: PedidoService) {}

  @HasRoles(Role.AdminPedido, Role.LecturaPedido)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  async findAll() {
    return await this.pedidoService.findAll();
  }

  @HasRoles(Role.AdminPedido, Role.LecturaPedido)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':pedidoId')
  async findOne(@Param('pedidoId') pedidoId: string) {
    return await this.pedidoService.findOne(pedidoId);
  }

  @HasRoles(Role.AdminPedido, Role.EscrituraPedido)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  async create(@Body() pedidoDto: PedidoDto) {
    const pedido: PedidoEntity = plainToInstance(PedidoEntity, pedidoDto);
    return await this.pedidoService.create(pedido);
  }

  @HasRoles(Role.AdminPedido, Role.EscrituraPedido)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':pedidoId')
  async update(
    @Param('pedidoId') pedidoId: string,
    @Body() pedidoDto: PedidoDto,
  ) {
    const pedido: PedidoEntity = plainToInstance(PedidoEntity, pedidoDto);
    return await this.pedidoService.update(pedidoId, pedido);
  }

  @HasRoles(Role.AdminPedido, Role.EliminarPedido)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':pedidoId')
  @HttpCode(204)
  async delete(@Param('pedidoId') pedidoId: string) {
    return await this.pedidoService.delete(pedidoId);
  }
}

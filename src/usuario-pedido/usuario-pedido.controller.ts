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
  UseGuards,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PedidoDto } from 'src/pedido/pedido.dto';
import { PedidoEntity } from 'src/pedido/pedido.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { UsuarioPedidoService } from './usuario-pedido.service';
import { RolesGuard } from '../auth/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { HasRoles } from '../auth/has-roles.decorator';
import { Role } from '../auth/role.enum';

@Controller('usuarios')
@UseInterceptors(BusinessErrorsInterceptor)
export class UsuarioPedidoController {
  constructor(private readonly usuarioPedidoService: UsuarioPedidoService) {}

  @HasRoles(Role.AdminUsuario, Role.EscrituraUsuario, Role.AdminPedido, Role.EscrituraPedido)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post(':usuarioId/pedidos/:pedidoId')
  async addPedidoUsuario(
    @Param('usuarioId') usuarioId: string,
    @Param('pedidoId') pedidoId: string,
  ) {
    return await this.usuarioPedidoService.addPedidoUsuario(
      usuarioId,
      pedidoId,
    );
  }

  @HasRoles(Role.AdminUsuario, Role.LecturaUsuario, Role.AdminPedido, Role.LecturaPedido)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':usuarioId/pedidos/:pedidoId')
  async findPedidoByusuarioIdpedidoId(
    @Param('usuarioId') usuarioId: string,
    @Param('pedidoId') pedidoId: string,
  ) {
    return await this.usuarioPedidoService.findPedidoByUsuarioIdPedidoId(
      usuarioId,
      pedidoId,
    );
  }

  @HasRoles(Role.AdminUsuario, Role.LecturaUsuario, Role.AdminPedido, Role.LecturaPedido)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':usuarioId/pedidos')
  async findPedidosByusuarioId(@Param('usuarioId') usuarioId: string) {
    return await this.usuarioPedidoService.findPedidoByUsuarioId(usuarioId);
  }

  @HasRoles(Role.AdminUsuario, Role.EscrituraUsuario, Role.AdminPedido, Role.EscrituraPedido)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':usuarioId/pedidos')
  async associatePedidosMuseum(
    @Body() pedidosDto: PedidoDto[],
    @Param('usuarioId') usuarioId: string,
  ) {
    const pedidos = plainToInstance(PedidoEntity, pedidosDto);
    return await this.usuarioPedidoService.associatePedidoUsuario(
      usuarioId,
      pedidos,
    );
  }

  @HasRoles(Role.AdminUsuario, Role.EliminarUsuario, Role.AdminPedido, Role.EliminarPedido)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':usuarioId/pedidos/:pedidoId')
  @HttpCode(204)
  async deletePedidoMuseum(
    @Param('usuarioId') usuarioId: string,
    @Param('pedidoId') pedidoId: string,
  ) {
    return await this.usuarioPedidoService.deletePedidoUsuario(
      usuarioId,
      pedidoId,
    );
  }
}

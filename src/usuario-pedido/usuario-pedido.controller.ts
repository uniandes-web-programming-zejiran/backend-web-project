/*
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PedidoDto } from 'src/pedido/pedido.dto';
import { PedidoEntity } from 'src/pedido/pedido.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { UsuarioPedidoService } from './usuario-pedido.service';

@Controller('usuarios')
@UseInterceptors(BusinessErrorsInterceptor)
export class UsuarioPedidoController {
    constructor(private readonly usuarioPedidoService: UsuarioPedidoService) { }

    @Post(':usuarioId/pedidos/:pedidoId')
    async addPedidoUsuario(@Param('usuarioId') usuarioId: string, @Param('pedidoId') pedidoId: string) {
        return await this.usuarioPedidoService.addPedidoUsuario(usuarioId, pedidoId);
    }

    @Get(':usuarioId/pedidos/:pedidoId')
    async findPedidoByusuarioIdpedidoId(@Param('usuarioId') usuarioId: string, @Param('pedidoId') pedidoId: string) {
        return await this.usuarioPedidoService.findPedidoByUsuarioIdPedidoId(usuarioId, pedidoId);
    }

    @Get(':usuarioId/pedidos')
    async findPedidosByusuarioId(@Param('usuarioId') usuarioId: string) {
        return await this.usuarioPedidoService.findPedidoByUsuarioId(usuarioId);
    }
    
    @Put(':usuarioId/pedidos')
    async associatePedidosMuseum(@Body() pedidosDto: PedidoDto[], @Param('usuarioId') usuarioId: string) {
        const pedidos = plainToInstance(PedidoEntity, pedidosDto)
        return await this.usuarioPedidoService.associatePedidoUsuario(usuarioId, pedidos);
    }

    @Delete(':usuarioId/pedidos/:pedidoId')
    @HttpCode(204)
    async deletePedidoMuseum(@Param('usuarioId') usuarioId: string, @Param('pedidoId') pedidoId: string) {
        return await this.usuarioPedidoService.deletePedidoUsuario(usuarioId, pedidoId);
    }
}
*/
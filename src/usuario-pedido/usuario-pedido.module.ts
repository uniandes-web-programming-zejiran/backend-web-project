import { Module } from '@nestjs/common';
import { UsuarioPedidoService } from './usuario-pedido.service';
import { UsuarioPedidoController } from './usuario-pedido.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioEntity } from '../usuario/usuario.entity';
import { PedidoEntity } from '../pedido/pedido.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UsuarioEntity, PedidoEntity])],
  providers: [UsuarioPedidoService],
  controllers: [UsuarioPedidoController],
})
export class UsuarioPedidoModule {}

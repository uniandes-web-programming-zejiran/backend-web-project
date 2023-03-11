import { Module } from '@nestjs/common';
import { UsuarioPedidoService } from './usuario-pedido.service';
//import { UsuarioPedidoController } from './usuario-pedido.controller';

@Module({
  providers: [UsuarioPedidoService]
  //,controllers: [UsuarioPedidoController]
})
export class UsuarioPedidoModule {}
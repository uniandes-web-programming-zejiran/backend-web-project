import { Module } from '@nestjs/common';
import { UsuarioPedidoService } from './usuario-pedido.service';

@Module({
  providers: [UsuarioPedidoService]
})
export class UsuarioPedidoModule {}
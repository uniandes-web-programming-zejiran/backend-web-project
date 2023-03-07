import { Module } from '@nestjs/common';
import { PedidoEntity } from './pedido.entity';
import { PedidoService } from './pedido.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([PedidoEntity])],
  providers: [PedidoService],
})
export class PedidoModule {}

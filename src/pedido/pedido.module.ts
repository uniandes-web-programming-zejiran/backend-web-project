import { Module } from '@nestjs/common';
import { PedidoEntity } from './pedido.entity';
import { PedidoService } from './pedido.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PedidoController } from './pedido.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PedidoEntity])],
  providers: [PedidoService],
  controllers: [PedidoController],
})
export class PedidoModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PedidoEntity } from 'src/pedido/pedido.entity';
import { ProductoEntity } from 'src/producto/producto.entity';
import { ProductoPedidoService } from './producto-pedido.service';
import { ProductoPedidoController } from './producto-pedido.controller';

@Module({
  providers: [ProductoPedidoService],
  imports: [TypeOrmModule.forFeature([PedidoEntity, ProductoEntity])],
  controllers: [ProductoPedidoController],
})
export class ProductoPedidoModule {}

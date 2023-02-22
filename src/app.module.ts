import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NegocioModule } from './negocio/negocio.module';
import { ProductoModule } from './producto/producto.module';
import { PedidoModule } from './pedido/pedido.module';
import { PagoModule } from './pago/pago.module';


@Module({
  imports: [NegocioModule, ProductoModule, PagoModule, PedidoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

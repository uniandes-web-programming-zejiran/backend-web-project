import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NegocioModule } from './negocio/negocio.module';
import { ProductoModule } from './producto/producto.module';
import { PedidoModule } from './pedido/pedido.module';
import { PagoModule } from './pago/pago.module';
import { ReviewModule } from './review/review.module';
import { EventoModule } from './evento/evento.module';
import { UsuarioModule } from './usuario/usuario.module';
import { CarritoModule } from './carrito/carrito.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    NegocioModule,
    ProductoModule,
    PagoModule,
    PedidoModule,
    ReviewModule,
    EventoModule,
    UsuarioModule,
    CarritoModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'ecoweb',
      entities: [
        NegocioModule,
        ProductoModule,
        PagoModule,
        PedidoModule,
        ReviewModule,
        EventoModule,
        UsuarioModule,
        CarritoModule,
      ],
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

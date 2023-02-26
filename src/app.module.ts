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
import { CarritoEntity } from './carrito/carrito.entity';
import { EventoEntity } from './evento/evento.entity';
import { NegocioEntity } from './negocio/negocio.entity';
import { PagoEntity } from './pago/pago.entity';
import { PedidoEntity } from './pedido/pedido.entity';
import { ProductoEntity } from './producto/producto.entity';
import { ReviewEntity } from './review/review.entity';
import { UsuarioEntity } from './usuario/usuario.entity';

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
        NegocioEntity,
        ProductoEntity,
        PagoEntity,
        PedidoEntity,
        ReviewEntity,
        EventoEntity,
        UsuarioEntity,
        CarritoEntity,
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

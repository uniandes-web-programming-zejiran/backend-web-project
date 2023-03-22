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
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublicacionModule } from './publicacion/publicacion.module';
import { PublicacionEntity } from './publicacion/publicacion.entity';
import { EventoEntity } from './evento/evento.entity';
import { NegocioEntity } from './negocio/negocio.entity';
import { PagoEntity } from './pago/pago.entity';
import { PedidoEntity } from './pedido/pedido.entity';
import { ProductoEntity } from './producto/producto.entity';
import { ReviewEntity } from './review/review.entity';
import { UsuarioEntity } from './usuario/usuario.entity';
import { NegocioProductoModule } from './negocio-producto/negocio-producto.module';
import { NegocioEventoModule } from './negocio-evento/negocio-evento.module';
import { ReviewUsuarioModule } from './review-usuario/review-usuario.module';
import { ReviewProductoModule } from './review-producto/review-producto.module';
import { UsuarioPublicacionModule } from './usuario-publicacion/usuario-publicacion.module';
import { UsuarioPedidoModule } from './usuario-pedido/usuario-pedido.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    NegocioModule,
    ProductoModule,
    PagoModule,
    PedidoModule,
    ReviewModule,
    EventoModule,
    UsuarioModule,
    PublicacionModule,
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
        PublicacionEntity,
      ],
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true,
    }),
    NegocioProductoModule,
    NegocioEventoModule,
    ReviewUsuarioModule,
    ReviewProductoModule,
    UsuarioPublicacionModule,
    UsuarioPedidoModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

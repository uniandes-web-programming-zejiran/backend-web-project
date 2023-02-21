import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NegocioModule } from './negocio/negocio.module';
import { ProductoModule } from './producto/producto.module';

@Module({
  imports: [NegocioModule, ProductoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

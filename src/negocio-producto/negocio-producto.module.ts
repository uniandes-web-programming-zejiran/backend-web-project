import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NegocioEntity } from 'src/negocio/negocio.entity';
import { ProductoEntity } from 'src/producto/producto.entity';
import { NegocioProductoService } from './negocio-producto.service';

@Module({
  providers: [NegocioProductoService],
  imports: [TypeOrmModule.forFeature([NegocioEntity, ProductoEntity])]
})
export class NegocioProductoModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewEntity } from 'src/review/review.entity';
import { ProductoEntity } from 'src/producto/producto.entity';
import { ReviewProductoService } from './review-producto.service';

@Module({
  providers: [ReviewProductoService],
  imports: [TypeOrmModule.forFeature([ReviewEntity, ProductoEntity])],
})
export class ReviewProductoModule {}

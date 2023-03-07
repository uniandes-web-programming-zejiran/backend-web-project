import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewEntity } from 'src/review/review.entity';
import { UsuarioEntity } from 'src/usuario/usuario.entity';
import { ReviewUsuarioService } from './review-usuario.service';

@Module({
  providers: [ReviewUsuarioService],
  imports: [TypeOrmModule.forFeature([ReviewEntity, UsuarioEntity])],
})
export class ReviewUsuarioModule {}

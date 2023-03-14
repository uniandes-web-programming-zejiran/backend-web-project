import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewEntity } from 'src/review/review.entity';
import { UsuarioEntity } from 'src/usuario/usuario.entity';
import { ReviewUsuarioService } from './review-usuario.service';
import { ReviewUsuarioController } from './review-usuario.controller';

@Module({
  providers: [ReviewUsuarioService],
  imports: [TypeOrmModule.forFeature([ReviewEntity, UsuarioEntity])],
  controllers: [ReviewUsuarioController],
})
export class ReviewUsuarioModule {}

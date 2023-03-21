import { Module } from '@nestjs/common';
import { UsuarioPublicacionService } from './usuario-publicacion.service';
import { UsuarioPublicacionController } from './usuario-publicacion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioEntity } from '../usuario/usuario.entity';
import { PublicacionEntity } from '../publicacion/publicacion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UsuarioEntity, PublicacionEntity])],
  providers: [UsuarioPublicacionService],
  controllers: [UsuarioPublicacionController]
})
export class UsuarioPublicacionModule {}

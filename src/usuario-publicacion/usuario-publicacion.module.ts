import { Module } from '@nestjs/common';
import { UsuarioPublicacionService } from './usuario-publicacion.service';
import { UsuarioPublicacionController } from './usuario-publicacion.controller';

@Module({
  providers: [UsuarioPublicacionService],
  controllers: [UsuarioPublicacionController]
})
export class UsuarioPublicacionModule {}

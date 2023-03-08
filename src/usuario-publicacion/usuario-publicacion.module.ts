import { Module } from '@nestjs/common';
import { UsuarioPublicacionService } from './usuario-publicacion.service';

@Module({
  providers: [UsuarioPublicacionService]
})
export class UsuarioPublicacionModule {}

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PublicacionDto } from 'src/publicacion/publicacion.dto';
import { PublicacionEntity } from 'src/publicacion/publicacion.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { UsuarioPublicacionService } from './usuario-publicacion.service';
import { RolesGuard } from '../auth/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { HasRoles } from '../auth/has-roles.decorator';
import { Role } from '../auth/role.enum';

@Controller('usuarios')
@UseInterceptors(BusinessErrorsInterceptor)
export class UsuarioPublicacionController {
  constructor(
    private readonly usuarioPublicacionService: UsuarioPublicacionService,
  ) {}

  @HasRoles(Role.AdminUsuario, Role.EscrituraUsuario, Role.AdminPublicacion, Role.EscrituraPublicacion)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post(':usuarioId/publicaciones/:publicacionId')
  async addPublicacionUsuario(
    @Param('usuarioId') usuarioId: string,
    @Param('publicacionId') publicacionId: string,
  ) {
    return await this.usuarioPublicacionService.addPublicacionUsuario(
      usuarioId,
      publicacionId,
    );
  }

  @HasRoles(Role.AdminUsuario, Role.LecturaUsuario, Role.AdminPublicacion, Role.LecturaPublicacion)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':usuarioId/publicaciones/:publicacionId')
  async findPublicacionByusuarioIdpublicacionId(
    @Param('usuarioId') usuarioId: string,
    @Param('publicacionId') publicacionId: string,
  ) {
    return await this.usuarioPublicacionService.findPublicacionByUsuarioIdPublicacionId(
      usuarioId,
      publicacionId,
    );
  }

  @HasRoles(Role.AdminUsuario, Role.LecturaUsuario, Role.AdminPublicacion, Role.LecturaPublicacion)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':usuarioId/publicaciones')
  async findPublicacionsByusuarioId(@Param('usuarioId') usuarioId: string) {
    return await this.usuarioPublicacionService.findPublicacionByUsuarioId(
      usuarioId,
    );
  }

  @HasRoles(Role.AdminUsuario, Role.EscrituraUsuario, Role.AdminPublicacion, Role.EscrituraPublicacion)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':usuarioId/publicaciones')
  async associatePublicacionsMuseum(
    @Body() publicacionesDto: PublicacionDto[],
    @Param('usuarioId') usuarioId: string,
  ) {
    const publicaciones = plainToInstance(PublicacionEntity, publicacionesDto);
    return await this.usuarioPublicacionService.associatePublicacionUsuario(
      usuarioId,
      publicaciones,
    );
  }

  @HasRoles(Role.AdminUsuario, Role.EliminarUsuario, Role.AdminPublicacion, Role.EliminarPublicacion)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':usuarioId/publicaciones/:publicacionId')
  @HttpCode(204)
  async deletePublicacionMuseum(
    @Param('usuarioId') usuarioId: string,
    @Param('publicacionId') publicacionId: string,
  ) {
    return await this.usuarioPublicacionService.deletePublicacionUsuario(
      usuarioId,
      publicacionId,
    );
  }
}

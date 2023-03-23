import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { UsuarioDto } from './usuario.dto';
import { UsuarioEntity } from './usuario.entity';
import { UsuarioService } from './usuario.service';
import { HasRoles } from '../auth/has-roles.decorator';
import { Role } from '../auth/role.enum';
import { RolesGuard } from '../auth/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('usuarios')
@UseInterceptors(BusinessErrorsInterceptor)
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @HasRoles(Role.AdminUsuario, Role.LecturaUsuario)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  async findAll() {
    return await this.usuarioService.findAll();
  }

  @HasRoles(Role.AdminUsuario, Role.LecturaUsuario)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':usuarioId')
  async findOne(@Param('usuarioId') usuarioId: string) {
    return await this.usuarioService.findOne(usuarioId);
  }

  @HasRoles(Role.AdminUsuario, Role.EscrituraUsuario)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  async create(@Body() UsuarioDto: UsuarioDto) {
    const usuario: UsuarioEntity = plainToInstance(UsuarioEntity, UsuarioDto);
    return await this.usuarioService.create(usuario);
  }

  @HasRoles(Role.AdminUsuario, Role.EscrituraUsuario)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':usuarioId')
  async update(
    @Param('usuarioId') usuarioId: string,
    @Body() UsuarioDto: UsuarioDto,
  ) {
    const usuario: UsuarioEntity = plainToInstance(UsuarioEntity, UsuarioDto);
    return await this.usuarioService.update(usuarioId, usuario);
  }

  @HasRoles(Role.AdminUsuario, Role.EliminarUsuario)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':usuarioId')
  @HttpCode(204)
  async delete(@Param('usuarioId') usuarioId: string) {
    return await this.usuarioService.delete(usuarioId);
  }
}

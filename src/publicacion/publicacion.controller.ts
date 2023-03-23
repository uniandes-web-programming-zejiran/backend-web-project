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
import { PublicacionDto } from './publicacion.dto';
import { PublicacionEntity } from './publicacion.entity';
import { PublicacionService } from './publicacion.service';
import { HasRoles } from '../auth/has-roles.decorator';
import { Role } from '../auth/role.enum';
import { RolesGuard } from '../auth/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('publicaciones')
@UseInterceptors(BusinessErrorsInterceptor)
export class PublicacionController {
  constructor(private readonly publicacionService: PublicacionService) {}
  
  @HasRoles(Role.AdminPublicacion, Role.LecturaPublicacion)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  async findAll() {
    return await this.publicacionService.findAll();
  }

  @HasRoles(Role.AdminPublicacion, Role.LecturaPublicacion)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':publicacionId')
  async findOne(@Param('publicacionId') publicacionId: string) {
    return await this.publicacionService.findOne(publicacionId);
  }

  @HasRoles(Role.AdminPublicacion, Role.EscrituraPublicacion)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  async create(@Body() publicacionDto: PublicacionDto) {
    const publicacion: PublicacionEntity = plainToInstance(
      PublicacionEntity,
      publicacionDto,
    );
    return await this.publicacionService.create(publicacion);
  }

  @HasRoles(Role.AdminPublicacion, Role.EscrituraPublicacion)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':publicacionId')
  async update(
    @Param('publicacionId') publicacionId: string,
    @Body() publicacionDto: PublicacionDto,
  ) {
    const publicacion: PublicacionEntity = plainToInstance(
      PublicacionEntity,
      publicacionDto,
    );
    return await this.publicacionService.update(publicacionId, publicacion);
  }

  @HasRoles(Role.AdminPublicacion, Role.EliminarPublicacion)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':publicacionId')
  @HttpCode(204)
  async delete(@Param('publicacionId') publicacionId: string) {
    return await this.publicacionService.delete(publicacionId);
  }
}

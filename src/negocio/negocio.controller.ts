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
import { RolesGuard } from '../auth/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { NegocioDto } from './negocio.dto';
import { NegocioEntity } from './negocio.entity';
import { NegocioService } from './negocio.service';
import { HasRoles } from '../auth/has-roles.decorator';
import { Role } from '../auth/role.enum';

@Controller('negocios')
@UseInterceptors(BusinessErrorsInterceptor)
export class NegocioController {
  constructor(private readonly negocioService: NegocioService) {}

  @HasRoles(Role.AdminNegocio, Role.LecturaNegocio)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  async findAll() {
    return await this.negocioService.findAll();
  }

  @HasRoles(Role.AdminNegocio, Role.LecturaNegocio)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':negocioId')
  async findOne(@Param('negocioId') negocioId: string) {
    return await this.negocioService.findOne(negocioId);
  }

  @HasRoles(Role.AdminNegocio, Role.EscrituraNegocio)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  async create(@Body() negocioDto: NegocioDto) {
    const negocio: NegocioEntity = plainToInstance(NegocioEntity, negocioDto);
    return await this.negocioService.create(negocio);
  }

  @HasRoles(Role.AdminNegocio, Role.EscrituraNegocio)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':negocioId')
  async update(
    @Param('negocioId') negocioId: string,
    @Body() negocioDto: NegocioDto,
  ) {
    const negocio: NegocioEntity = plainToInstance(NegocioEntity, negocioDto);
    return await this.negocioService.update(negocioId, negocio);
  }

  @HasRoles(Role.AdminNegocio, Role.EliminarNegocio)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':negocioId')
  @HttpCode(204)
  async delete(@Param('negocioId') negocioId: string) {
    return await this.negocioService.delete(negocioId);
  }
}

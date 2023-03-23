/* eslint-disable prettier/prettier */
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
import { EventoDto } from './evento.dto';
import { EventoEntity } from './evento.entity';
import { EventoService } from './evento.service';
import { HasRoles } from '../auth/has-roles.decorator';
import { Role } from '../auth/role.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('eventos')
@UseInterceptors(BusinessErrorsInterceptor)
export class EventoController {
  constructor(private readonly eventoService: EventoService) {}

  @HasRoles(Role.AdminEvento, Role.LecturaEvento)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  async findAll() {
    return await this.eventoService.findAll();
  }

  @HasRoles(Role.AdminEvento, Role.LecturaEvento)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':eventoId')
  async findOne(@Param('eventoId') eventoId: string) {
    return await this.eventoService.findOne(eventoId);
  }

  @HasRoles(Role.AdminEvento, Role.EscrituraEvento)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  async create(@Body() eventoDto: EventoDto) {
    const evento: EventoEntity = plainToInstance(EventoEntity, eventoDto);
    return await this.eventoService.create(evento);
  }

  @HasRoles(Role.AdminEvento, Role.EscrituraEvento)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':eventoId')
  async update(
    @Param('eventoId') eventoId: string,
    @Body() eventoDto: EventoDto,
  ) {
    const evento: EventoEntity = plainToInstance(EventoEntity, eventoDto);
    return await this.eventoService.update(eventoId, evento);
  }

  @HasRoles(Role.AdminEvento, Role.EliminarEvento)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':eventoId')
  @HttpCode(204)
  async delete(@Param('eventoId') eventoId: string) {
    return await this.eventoService.delete(eventoId);
  }
}

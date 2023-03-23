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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { HasRoles } from '../auth/has-roles.decorator';
import { Role } from '../auth/role.enum';
import { EventoDto } from '../evento/evento.dto';
import { EventoEntity } from '../evento/evento.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { NegocioEventoService } from './negocio-evento.service';

@Controller('negocios')
@UseInterceptors(BusinessErrorsInterceptor)
export class NegocioEventoController {
  constructor(private readonly negocioEventoService: NegocioEventoService) {}

  @HasRoles(Role.AdminNegocio, Role.EscrituraNegocio, Role.AdminEvento, Role.EscrituraEvento)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post(':negocioId/eventos/:eventoId')
  async addEventoNegocio(
    @Param('negocioId') negocioId: string,
    @Param('eventoId') eventoId: string,
  ) {
    return await this.negocioEventoService.addEventoNegocio(
      negocioId,
      eventoId,
    );
  }

  @HasRoles(Role.AdminNegocio, Role.LecturaNegocio, Role.AdminEvento, Role.LecturaEvento)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':negocioId/eventos/:eventoId')
  async findEventoByNegocioIdEventoId(
    @Param('negocioId') negocioId: string,
    @Param('eventoId') eventoId: string,
  ) {
    return await this.negocioEventoService.findEventoByNegocioIdEventoId(
      negocioId,
      eventoId,
    );
  }

  @HasRoles(Role.AdminNegocio, Role.LecturaNegocio, Role.AdminEvento, Role.LecturaEvento)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':negocioId/eventos')
  async findEventosByNegocioId(@Param('negocioId') negocioId: string) {
    return await this.negocioEventoService.findEventosByNegocioId(negocioId);
  }

  @HasRoles(Role.AdminNegocio, Role.EscrituraNegocio, Role.AdminEvento, Role.EscrituraEvento)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':negocioId/eventos')
  async associateEventosNegocio(
    @Body() eventosDto: EventoDto[],
    @Param('negocioId') negocioId: string,
  ) {
    const eventos = plainToInstance(EventoEntity, eventosDto);
    return await this.negocioEventoService.associateEventosNegocio(
      negocioId,
      eventos,
    );
  }

  @HasRoles(Role.AdminNegocio, Role.EliminarNegocio, Role.AdminEvento, Role.EliminarEvento)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':negocioId/eventos/:eventoId')
  @HttpCode(204)
  async deleteEventoNegocio(
    @Param('negocioId') negocioId: string,
    @Param('eventoId') eventoId: string,
  ) {
    return await this.negocioEventoService.deleteEventoNegocio(
      negocioId,
      eventoId,
    );
  }
}

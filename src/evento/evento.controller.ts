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
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { EventoDto } from './evento.dto';
import { EventoEntity } from './evento.entity';
import { EventoService } from './evento.service';

@Controller('eventos')
@UseInterceptors(BusinessErrorsInterceptor)
export class EventoController {
  constructor(private readonly eventoService: EventoService) {}

  @Get()
  async findAll() {
    return await this.eventoService.findAll();
  }

  @Get(':eventoId')
  async findOne(@Param('eventoId') eventoId: string) {
    return await this.eventoService.findOne(eventoId);
  }

  @Post()
  async create(@Body() eventoDto: EventoDto) {
    const evento: EventoEntity = plainToInstance(EventoEntity, eventoDto);
    return await this.eventoService.create(evento);
  }

  @Put(':eventoId')
  async update(
    @Param('eventoId') eventoId: string,
    @Body() eventoDto: EventoDto,
  ) {
    const evento: EventoEntity = plainToInstance(EventoEntity, eventoDto);
    return await this.eventoService.update(eventoId, evento);
  }

  @Delete(':eventoId')
  @HttpCode(204)
  async delete(@Param('eventoId') eventoId: string) {
    return await this.eventoService.delete(eventoId);
  }
}

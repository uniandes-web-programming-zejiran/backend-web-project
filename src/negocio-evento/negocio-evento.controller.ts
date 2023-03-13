import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { EventoDto } from '../evento/evento.dto';
import { EventoEntity } from '../evento/evento.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { NegocioEventoService } from './negocio-evento.service';

@Controller('negocios')
@UseInterceptors(BusinessErrorsInterceptor)
export class NegocioEventoController {

    constructor(private readonly negocioEventoService: NegocioEventoService){}

    @Post(':negocioId/eventos/:eventoId')
    async addEventoNegocio(@Param('negocioId') negocioId: string, @Param('eventoId') eventoId: string){
       return await this.negocioEventoService.addEventoNegocio(negocioId, eventoId);
    }

    @Get(':negocioId/eventos/:eventoId')
    async findEventoByNegocioIdEventoId(@Param('negocioId') negocioId: string, @Param('eventoId') eventoId: string){
       return await this.negocioEventoService.findEventoByNegocioIdEventoId(negocioId, eventoId);
    }

    @Get(':negocioId/eventos')
    async findEventosByNegocioId(@Param('negocioId') negocioId: string){
       return await this.negocioEventoService.findEventosByNegocioId(negocioId);
    }

    @Put(':negocioId/eventos')
    async associateEventosNegocio(@Body() eventosDto: EventoDto[], @Param('negocioId') negocioId: string){
       const eventos = plainToInstance(EventoEntity, eventosDto)
       return await this.negocioEventoService.associateEventosNegocio(negocioId, eventos);
    }

    @Delete(':negocioId/eventos/:eventoId')
    @HttpCode(204)
    async deleteEventoNegocio(@Param('negocioId') negocioId: string, @Param('eventoId') eventoId: string){
       return await this.negocioEventoService.deleteEventoNegocio(negocioId, eventoId);
    }

}

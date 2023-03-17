import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { NegocioDto } from './negocio.dto';
import { NegocioEntity } from './negocio.entity';
import { NegocioService } from './negocio.service';

@Controller('negocios')
@UseInterceptors(BusinessErrorsInterceptor)
export class NegocioController {

    constructor(private readonly negocioService: NegocioService) {}

    @Get()
    async findAll() {
        return await this.negocioService.findAll();
    }

    @Get(':negocioId')
    async findOne(@Param('negocioId') negocioId: string) {
        return await this.negocioService.findOne(negocioId);
    }

    @Post()
    async create(@Body() negocioDto: NegocioDto) {
        const negocio: NegocioEntity = plainToInstance(NegocioEntity, negocioDto);
        return await this.negocioService.create(negocio);
    }

    @Put(':negocioId')
    async update(@Param('negocioId') negocioId: string, @Body() negocioDto: NegocioDto) {
        const negocio: NegocioEntity = plainToInstance(NegocioEntity, negocioDto);
        return await this.negocioService.update(negocioId, negocio);
    }

    @Delete(':negocioId')
    @HttpCode(204)
    async delete(@Param('negocioId') negocioId: string) {
        return await this.negocioService.delete(negocioId);
    }

}

import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put } from '@nestjs/common';
import { UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { PublicacionDto } from './publicacion.dto';
import { PublicacionEntity } from './publicacion.entity';
import { PublicacionService } from './publicacion.service';

@Controller('publicaciones')
@UseInterceptors(BusinessErrorsInterceptor)
export class PublicacionController {

    constructor(private readonly publicacionService: PublicacionService) { }

    @Get()
    async findAll() {
        return await this.publicacionService.findAll();
    }

    @Get(':museumId')
    async findOne(@Param('museumId') museumId: string) {
        return await this.publicacionService.findOne(museumId);
    }

    @Post()
    async create(@Body() museumDto: PublicacionDto) {
        const museum: PublicacionEntity = plainToInstance(PublicacionEntity, museumDto);
        return await this.publicacionService.create(museum);
    }

    @Put(':museumId')
    async update(@Param('museumId') museumId: string, @Body() museumDto: PublicacionDto) {
        const museum: PublicacionEntity = plainToInstance(PublicacionEntity, museumDto);
        return await this.publicacionService.update(museumId, museum);
    }

    @Delete(':museumId')
    @HttpCode(204)
    async delete(@Param('museumId') museumId: string) {
        return await this.publicacionService.delete(museumId);
    }

}

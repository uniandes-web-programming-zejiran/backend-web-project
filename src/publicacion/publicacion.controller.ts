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

    @Get(':publicacionId')
    async findOne(@Param('publicacionId') publicacionId: string) {
        return await this.publicacionService.findOne(publicacionId);
    }

    @Post()
    async create(@Body() publicacionDto: PublicacionDto) {
        const publicacion: PublicacionEntity = plainToInstance(PublicacionEntity, publicacionDto);
        return await this.publicacionService.create(publicacion);
    }

    @Put(':publicacionId')
    async update(@Param('publicacionId') publicacionId: string, @Body() publicacionDto: PublicacionDto) {
        const publicacion: PublicacionEntity = plainToInstance(PublicacionEntity, publicacionDto);
        return await this.publicacionService.update(publicacionId, publicacion);
    }

    @Delete(':publicacionId')
    @HttpCode(204)
    async delete(@Param('publicacionId') publicacionId: string) {
        return await this.publicacionService.delete(publicacionId);
    }

}

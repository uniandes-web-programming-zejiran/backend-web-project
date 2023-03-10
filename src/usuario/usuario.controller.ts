import { Body, Controller, Delete, Get, HttpCode, Injectable, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { UsuarioDto } from './usuario.dto';
import { UsuarioEntity } from './usuario.entity';
import { UsuarioService } from './usuario.service';

@Controller('usuarios')
@UseInterceptors(BusinessErrorsInterceptor)
export class UsuarioController {

    constructor(private readonly usuarioService: UsuarioService) { }

    @Get()
    async findAll() {
        return await this.usuarioService.findAll();
    }

    @Get(':usuarioId')
    async findOne(@Param('usuarioId') usuarioId: string) {
        return await this.usuarioService.findOne(usuarioId);
    }

    @Post()
    async create(@Body() UsuarioDto: UsuarioDto) {
        const usuario: UsuarioEntity = plainToInstance(UsuarioEntity, UsuarioDto);
        return await this.usuarioService.create(usuario);
    }

    @Put(':usuarioId')
    async update(@Param('usuarioId') usuarioId: string, @Body() UsuarioDto: UsuarioDto) {
        const usuario: UsuarioEntity = plainToInstance(UsuarioEntity, UsuarioDto);
        return await this.usuarioService.update(usuarioId, usuario);
    }

    @Delete(':usuarioId')
    @HttpCode(204)
    async delete(@Param('usuarioId') usuarioId: string) {
        return await this.usuarioService.delete(usuarioId);
    }

}

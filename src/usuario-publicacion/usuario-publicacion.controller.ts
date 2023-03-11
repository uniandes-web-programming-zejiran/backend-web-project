import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PublicacionDto } from 'src/publicacion/publicacion.dto';
import { PublicacionEntity } from 'src/publicacion/publicacion.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { UsuarioPublicacionService } from './usuario-publicacion.service';

@Controller('usuarios')
@UseInterceptors(BusinessErrorsInterceptor)
export class UsuarioPublicacionController {
    constructor(private readonly usuarioPublicacionService: UsuarioPublicacionService) { }

    @Post(':usuarioId/publicaciones/:publicacionId')
    async addPublicacionUsuario(@Param('usuarioId') usuarioId: string, @Param('publicacionId') publicacionId: string) {
        return await this.usuarioPublicacionService.addPublicacionUsuario(usuarioId, publicacionId);
    }

    @Get(':usuarioId/publicaciones/:publicacionId')
    async findPublicacionByusuarioIdpublicacionId(@Param('usuarioId') usuarioId: string, @Param('publicacionId') publicacionId: string) {
        return await this.usuarioPublicacionService.findPublicacionByUsuarioIdPublicacionId(usuarioId, publicacionId);
    }

    @Get(':usuarioId/publicaciones')
    async findPublicacionsByusuarioId(@Param('usuarioId') usuarioId: string) {
        return await this.usuarioPublicacionService.findPublicacionByUsuarioId(usuarioId);
    }

    @Put(':usuarioId/publicaciones')
    async associatePublicacionsMuseum(@Body() publicacionesDto: PublicacionDto[], @Param('usuarioId') usuarioId: string) {
        const publicaciones = plainToInstance(PublicacionEntity, publicacionesDto)
        return await this.usuarioPublicacionService.associatePublicacionUsuario(usuarioId, publicaciones);
    }

    @Delete(':usuarioId/publicaciones/:publicacionId')
    @HttpCode(204)
    async deletePublicacionMuseum(@Param('usuarioId') usuarioId: string, @Param('publicacionId') publicacionId: string) {
        return await this.usuarioPublicacionService.deletePublicacionUsuario(usuarioId, publicacionId);
    }
}

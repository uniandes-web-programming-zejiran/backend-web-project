import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PublicacionEntity } from '../publicacion/publicacion.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { UsuarioEntity } from '../usuario/usuario.entity';

@Injectable()
export class UsuarioPublicacionService {

    constructor(
        @InjectRepository(UsuarioEntity)
        private readonly usuarioRepository: Repository<UsuarioEntity>,

        @InjectRepository(PublicacionEntity)
        private readonly publicacionRepository: Repository<PublicacionEntity>
    ) { }

    //Añaadir una publicacion a un usuario
    async addPublicacionUsuario(idUsuario: string, idPublicacion: string) {
        const publicacion: PublicacionEntity = await this.publicacionRepository.findOne({where: {id: idPublicacion}, relations: ["usuario"]});
        if(!publicacion) {
            throw new BusinessLogicException("La publicacion con el id dado no fue encontrada", BusinessError.NOT_FOUND);
        }

        const usuario: UsuarioEntity = await this.usuarioRepository.findOne({where: {id: idUsuario}, relations: ["publicaciones"]});
        if(!usuario) {
            throw new BusinessLogicException("El usuario con el id dado no fue encontrado", BusinessError.NOT_FOUND);
        }

        usuario.publicaciones = [...usuario.publicaciones, publicacion];
        return await this.usuarioRepository.save(usuario);
    }

    //Encontrar todas las publicaciones de un usuario por su id y el id de la publicacion
    async findPublicacionByUsuarioIdPublicacionId(idUsuario: string, idPublicacion: string) {
        const publicacion: PublicacionEntity = await this.publicacionRepository.findOne({where: {id: idPublicacion}});
        if(!publicacion) {
            throw new BusinessLogicException("La publicacion con el id dado no fue encontrada", BusinessError.NOT_FOUND);
        }

        const usuario: UsuarioEntity = await this.usuarioRepository.findOne({where: {id: idUsuario}, relations: ["publicaciones"]});
        if(!usuario) {
            throw new BusinessLogicException("El usuario con el id dado no fue encontrado", BusinessError.NOT_FOUND);
        }

        const usuarioPublicacion: PublicacionEntity = usuario.publicaciones.find(e => e.id === publicacion.id);
        if(!usuarioPublicacion) {
            throw new BusinessLogicException("La publicacion con el id dado no esta asociada al usuario", BusinessError.PRECONDITION_FAILED);
        }

        return usuarioPublicacion;
    }

    //Encontrar todas las publicaciones de un usuario por su id
    async findPublicacionByUsuarioId(idUsuario: string) {
        const usuario: UsuarioEntity = await this.usuarioRepository.findOne({where: {id: idUsuario}, relations: ["publicaciones"]});
        if(!usuario) {
            throw new BusinessLogicException("El usuario con el id dado no fue encontrado", BusinessError.NOT_FOUND);
        }
        return usuario.publicaciones;
    }

    // Asociar un arreglo de publicaciones a un usuario
    async associatePublicacionUsuario(idUsuario: string, publicaciones: PublicacionEntity[]): Promise<UsuarioEntity> {
        const usaurio: UsuarioEntity = await this.usuarioRepository.findOne({where: {id: idUsuario}, relations: ["publicaciones"]});
        if(!usaurio) {
            throw new BusinessLogicException("El usuario con el id dado no fue encontrado", BusinessError.NOT_FOUND);
        }

        for (let i = 0; i < publicaciones.length; i++) {
            const publicacion: PublicacionEntity = await this.publicacionRepository.findOne({where: {id: publicaciones[i].id}});
            if(!publicacion) {
                throw new BusinessLogicException("La publicacion con el id dado no fue encontrada", BusinessError.NOT_FOUND);
            }
        }

        usaurio.publicaciones = publicaciones;
        return await this.usuarioRepository.save(usaurio);
    }

    //Eliminar una publicacion de un usuario
    async deletePublicacionUsuario(idUsuario: string, idPublicacion: string) {
        const publicacion: PublicacionEntity = await this.publicacionRepository.findOne({where: {id: idPublicacion}});
        if(!publicacion) {
            throw new BusinessLogicException("La publicacion con el id dado no fue encontrada", BusinessError.NOT_FOUND);
        }

        const usuario: UsuarioEntity = await this.usuarioRepository.findOne({where: {id: idUsuario}, relations: ["publicaciones"]});
        if(!usuario) {
            throw new BusinessLogicException("El usuario con el id dado no fue encontrado", BusinessError.NOT_FOUND);
        }

        const usuarioPublicacion: PublicacionEntity = usuario.publicaciones.find(e => e.id === publicacion.id);
        if(!usuarioPublicacion) {
            throw new BusinessLogicException("La publicacion con el id dado no esta asociada al usuario", BusinessError.PRECONDITION_FAILED);
        }

        usuario.publicaciones = usuario.publicaciones.filter(e => e.id !== idPublicacion);
        return await this.usuarioRepository.save(usuario);
    }
}

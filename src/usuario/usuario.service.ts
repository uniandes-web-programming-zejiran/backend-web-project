import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'; 
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { UsuarioEntity } from './usuario.entity';

@Injectable()
export class UsuarioService {

    //Inyectar dependencias del servicio de usuario
    constructor(
        @InjectRepository(UsuarioEntity)
        private readonly usuarioRepository: Repository<UsuarioEntity>
    ) { }

    //Obtener todos los usuarios con sus relaciones
    async findAll(): Promise<UsuarioEntity[]> {
        return await this.usuarioRepository.find({ relations: ["reviews", "publicaciones", "pedidos"]});
    }

    //Obtener un usuario por su cedula
    async findOne(cedula: string): Promise<UsuarioEntity> {
        const usuario: UsuarioEntity = await this.usuarioRepository.findOne({where: {cedula}, relations: ["reviews", "publicaciones", "pedidos"]});
        if (!usuario) {
            throw new BusinessLogicException("El usuario con la cedula dada no fue encontrado", BusinessError.NOT_FOUND);
        }
        return usuario;
    }

    //Crear un usuario
    async create(usuario: UsuarioEntity): Promise<UsuarioEntity> {
        return await this.usuarioRepository.save(usuario);
    }

    //Actualizar un usuario por su cedula
    async update(cedula: string, usuario: UsuarioEntity): Promise<UsuarioEntity> {
        const persistedUsuario: UsuarioEntity = await this.usuarioRepository.findOne({where: {cedula}});
        if (!persistedUsuario) {
            throw new BusinessLogicException("El usuario con la cedula dada no fue encontrado", BusinessError.NOT_FOUND);
        }
        return await this.usuarioRepository.save({...persistedUsuario, ...usuario});
    }

    //Eliminar un usuario por su cedula
    async delete(cedula: string) {
        const usuario: UsuarioEntity = await this.usuarioRepository.findOne({where: {cedula}});
        if (!usuario) {
            throw new BusinessLogicException("El usuario con la cedula dada no fue encontrado", BusinessError.NOT_FOUND);
        }
        await this.usuarioRepository.remove(usuario);
    }
}

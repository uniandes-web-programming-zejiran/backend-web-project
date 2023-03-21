import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { PublicacionEntity } from './publicacion.entity';

@Injectable()
export class PublicacionService {
  //Inyectar dependencias del servicio de publicacion
  constructor(
    @InjectRepository(PublicacionEntity)
    private readonly publicacionRepository: Repository<PublicacionEntity>,
  ) {}

  //Obtener todas las publicaciones con sus relaciones
  async findAll(): Promise<PublicacionEntity[]> {
    return await this.publicacionRepository.find({ relations: ['usuario'] });
  }

  //Obtener una publicacion por su id
  async findOne(id: string): Promise<PublicacionEntity> {
    const publicacion: PublicacionEntity =
      await this.publicacionRepository.findOne({
        where: { id },
        relations: ['usuario'],
      });
    if (!publicacion) {
      throw new BusinessLogicException(
        'La publicacion con el id dado no fue encontrada',
        BusinessError.NOT_FOUND,
      );
    }
    return publicacion;
  }

  //Crear una publicacion
  async create(publicacion: PublicacionEntity): Promise<PublicacionEntity> {
    return await this.publicacionRepository.save(publicacion);
  }

  //Actualizar una publicacion por su id
  async update(
    id: string,
    publicacion: PublicacionEntity,
  ): Promise<PublicacionEntity> {
    const persistedPublicacion: PublicacionEntity =
      await this.publicacionRepository.findOne({ where: { id } });
    if (!persistedPublicacion) {
      throw new BusinessLogicException(
        'La publicacion con el id dado no fue encontrada',
        BusinessError.NOT_FOUND,
      );
    }
    return await this.publicacionRepository.save({
      ...persistedPublicacion,
      ...publicacion,
    });
  }

  //Eliminar una publicacion por su id
  async delete(id: string) {
    const publicacion: PublicacionEntity =
      await this.publicacionRepository.findOne({ where: { id } });
    if (!publicacion) {
      throw new BusinessLogicException(
        'La publicacion con el id dado no fue encontrada',
        BusinessError.NOT_FOUND,
      );
    }
    await this.publicacionRepository.remove(publicacion);
  }
}

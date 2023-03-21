import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { PublicacionEntity } from './publicacion.entity';
import { PublicacionService } from './publicacion.service';
import { faker } from '@faker-js/faker';
import { UsuarioEntity } from '../usuario/usuario.entity';

describe('PublicacionService', () => {
  let service: PublicacionService;
  let repository: Repository<PublicacionEntity>;
  let publicacionesList: PublicacionEntity[];
  let publicacion: PublicacionEntity;

  // Configuracion de la base de datos
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PublicacionService],
    }).compile();

    service = module.get<PublicacionService>(PublicacionService);
    repository = module.get<Repository<PublicacionEntity>>(
      getRepositoryToken(PublicacionEntity),
    );
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  //Metodo para poblar la base de datos
  const seedDatabase = async () => {
    repository.clear();
    publicacionesList = [];
    for (let i = 0; i < 5; i++) {
      const publicacion: PublicacionEntity = await repository.save({
        titulo: faker.lorem.sentence(),
        cuerpo: faker.lorem.paragraph(),
        fechaPublicacion: faker.date.past().toString(),
        imagen: faker.image.avatar(),
      });
      publicacionesList.push(publicacion);
    }
  };

  //Prueba para el metodo findAll
  it('findAll deberia retornar el listado de publicaciones', async () => {
    const publicaciones: PublicacionEntity[] = await service.findAll();
    expect(publicaciones).not.toBeNull();
    expect(publicaciones).toHaveLength(publicacionesList.length);
  });

  //Prueba para el metodo findOne
  it('findOne deberia retornar una publicacion por id', async () => {
    const storedPublicacion: PublicacionEntity = publicacionesList[0];
    const publicacion: PublicacionEntity = await service.findOne(
      storedPublicacion.id,
    );
    expect(publicacion).not.toBeNull();
    expect(publicacion.id).toEqual(storedPublicacion.id);
    expect(publicacion.titulo).toEqual(storedPublicacion.titulo);
    expect(publicacion.cuerpo).toEqual(storedPublicacion.cuerpo);
    expect(publicacion.fechaPublicacion).toEqual(
      storedPublicacion.fechaPublicacion,
    );
    expect(publicacion.imagen).toEqual(storedPublicacion.imagen);
  });

  //Prueba metodo findOne con id inexistente
  it('findOne deberia retornar exception para una publicacion no valida', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'La publicacion con el id dado no fue encontrada',
    );
  });

  //Prueba para el metodo create
  it('create deberia crear una publicacion', async () => {
    const publicacion: PublicacionEntity = {
      //generar un id random
      id: faker.random.numeric().toString(),
      titulo: faker.lorem.sentence(),
      cuerpo: faker.lorem.paragraph(),
      fechaPublicacion: faker.date.past().toString(),
      imagen: faker.image.avatar(),
      usuario: new UsuarioEntity(),
    };
    const newPublicacion: PublicacionEntity = await service.create(publicacion);
    expect(newPublicacion).not.toBeNull();

    const storedPublicacion: PublicacionEntity = await repository.findOne({
      where: { id: newPublicacion.id },
    });
    expect(storedPublicacion).not.toBeNull();
    expect(storedPublicacion.id).toEqual(newPublicacion.id);
    expect(storedPublicacion.titulo).toEqual(newPublicacion.titulo);
    expect(storedPublicacion.cuerpo).toEqual(newPublicacion.cuerpo);
    expect(storedPublicacion.fechaPublicacion).toEqual(
      newPublicacion.fechaPublicacion,
    );
    expect(storedPublicacion.imagen).toEqual(newPublicacion.imagen);
  });

  //Prueba para el metodo update
  it('update deberia actualizar una publicacion', async () => {
    const publicacion: PublicacionEntity = publicacionesList[0];
    publicacion.titulo = 'Nuevo titulo';
    publicacion.cuerpo = 'Nuevo cuerpo';
    const updatedPublicacion: PublicacionEntity = await service.update(
      publicacion.id,
      publicacion,
    );
    expect(updatedPublicacion).not.toBeNull();
    const storedPublicacion: PublicacionEntity = await repository.findOne({
      where: { id: publicacion.id },
    });
    expect(storedPublicacion).not.toBeNull();
    expect(storedPublicacion.titulo).toEqual(updatedPublicacion.titulo);
    expect(storedPublicacion.cuerpo).toEqual(updatedPublicacion.cuerpo);
  });

  //Prueba para el metodo update con id inexistente
  it('update deberia retornar exception para una publicacion no valida', async () => {
    let publicacion: PublicacionEntity = publicacionesList[0];
    publicacion = {
      ...publicacion,
      titulo: 'Nuevo titulo',
      cuerpo: 'Nuevo cuerpo',
    };
    expect(() => service.update('0', publicacion)).rejects.toHaveProperty(
      'message',
      'La publicacion con el id dado no fue encontrada',
    );
  });

  //Prueba para el metodo delete
  it('delete deberia eliminar una publicacion', async () => {
    const publicacion: PublicacionEntity = publicacionesList[0];
    await service.delete(publicacion.id);
    const deletedPublicacion: PublicacionEntity = await repository.findOne({
      where: { id: publicacion.id },
    });
    expect(deletedPublicacion).toBeNull();
  });

  //Prueba para el metodo delete con id inexistente
  it('delete deberia retornar exception para una publicacion no valida', async () => {
    const publicacion: PublicacionEntity = publicacionesList[0];
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'La publicacion con el id dado no fue encontrada',
    );
  });
});

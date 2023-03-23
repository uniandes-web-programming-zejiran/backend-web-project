import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { UsuarioEntity } from './usuario.entity';
import { UsuarioService } from './usuario.service';
import { faker } from '@faker-js/faker';

describe('UsuarioService', () => {
  let service: UsuarioService;
  let repository: Repository<UsuarioEntity>;
  let usuariosList: UsuarioEntity[];
  let usuario: UsuarioEntity;

  // Configuracion de la base de datos
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [UsuarioService],
    }).compile();

    service = module.get<UsuarioService>(UsuarioService);
    repository = module.get<Repository<UsuarioEntity>>(
      getRepositoryToken(UsuarioEntity),
    );
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  //Metodo para poblar la base de datos
  const seedDatabase = async () => {
    repository.clear();
    usuariosList = [];
    for (let i = 0; i < 5; i++) {
      const usuario: UsuarioEntity = await repository.save({
        id: faker.datatype.uuid(),
        cedula: faker.random.numeric(10).toString(),
        nombre: faker.name.firstName(),
        fechaInscripcion: faker.date.past().toString(),
        fechaNacimiento: faker.date.birthdate().toString(),
        imagen: faker.image.avatar(),
      });
      usuariosList.push(usuario);
    }
  };

  //Prueba para el metodo findAll
  it('findAll deberia retornar el listado de usuarios', async () => {
    const usuarios: UsuarioEntity[] = await service.findAll();
    expect(usuarios).not.toBeNull();
    expect(usuarios).toHaveLength(usuariosList.length);
  });

  //Prueba para el metodo findOne
  it('findOne deberia retornar un usuario por id', async () => {
    const storedUsuario: UsuarioEntity = usuariosList[0];
    const usuario: UsuarioEntity = await service.findOne(storedUsuario.id);
    expect(usuario).not.toBeNull();
    expect(usuario.cedula).toEqual(storedUsuario.cedula);
    expect(usuario.nombre).toEqual(storedUsuario.nombre);
    expect(usuario.fechaInscripcion).toEqual(storedUsuario.fechaInscripcion);
    expect(usuario.fechaNacimiento).toEqual(storedUsuario.fechaNacimiento);
    expect(usuario.imagen).toEqual(storedUsuario.imagen);
  });

  //Prueba metodo findOne con id inexistente
  it('findOne deberia retornar exception para un usuario no valido', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'El usuario con el id dado no fue encontrado',
    );
  });

  //Prueba para el metodo create
  it('create deberia crear un usuario', async () => {
    const usuario: UsuarioEntity = {
      id: faker.datatype.uuid(),
      cedula: faker.random.numeric(10).toString(),
      nombre: faker.name.firstName(),
      fechaInscripcion: faker.date.past().toString(),
      fechaNacimiento: faker.date.birthdate().toString(),
      imagen: faker.image.avatar(),
      reviews: [],
      publicaciones: [],
      pedidos: [],
    };
    const newUsuario: UsuarioEntity = await service.create(usuario);
    expect(newUsuario).not.toBeNull();

    const storedUsuario: UsuarioEntity = await repository.findOne({
      where: { id: newUsuario.id },
    });
    expect(storedUsuario).not.toBeNull();
    expect(storedUsuario.cedula).toEqual(newUsuario.cedula);
    expect(storedUsuario.nombre).toEqual(newUsuario.nombre);
    expect(storedUsuario.fechaInscripcion).toEqual(newUsuario.fechaInscripcion);
    expect(storedUsuario.fechaNacimiento).toEqual(newUsuario.fechaNacimiento);
    expect(storedUsuario.imagen).toEqual(newUsuario.imagen);
  });

  //Prueba para el metodo update
  it('update deberia actualizar un usuario', async () => {
    const usuario: UsuarioEntity = usuariosList[0];
    usuario.nombre = 'Nuevo nombre';
    usuario.imagen = faker.image.avatar();
    const updatedUsuario: UsuarioEntity = await service.update(
      usuario.id,
      usuario,
    );
    expect(updatedUsuario).not.toBeNull();
    const storedUsuario: UsuarioEntity = await repository.findOne({
      where: { id: usuario.id },
    });
    expect(storedUsuario).not.toBeNull();
    expect(storedUsuario.nombre).toEqual(usuario.nombre);
    expect(storedUsuario.imagen).toEqual(usuario.imagen);
  });

  //Prueba para el metodo update con id inexistente
  it('update deberia retornar exception para un usuario no valido', async () => {
    let usuario: UsuarioEntity = usuariosList[0];
    usuario = {
      ...usuario,
      nombre: 'Nuevo nombre',
      imagen: faker.image.avatar(),
    };
    expect(() => service.update('0', usuario)).rejects.toHaveProperty(
      'message',
      'El usuario con el id dado no fue encontrado',
    );
  });

  //Prueba para el metodo delete
  it('delete deberia eliminar un usuario', async () => {
    const usuario: UsuarioEntity = usuariosList[0];
    await service.delete(usuario.id);
    const deletedUsuario: UsuarioEntity = await repository.findOne({
      where: { id: usuario.id },
    });
    expect(deletedUsuario).toBeNull();
  });

  //Prueba para el metodo delete con id inexistente
  it('delete deberia retornar exception para un usuario no valido', async () => {
    const usuario: UsuarioEntity = usuariosList[0];
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'El usuario con el id dado no fue encontrado',
    );
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { PublicacionEntity } from '../publicacion/publicacion.entity';
import { UsuarioEntity } from '../usuario/usuario.entity';
import { Repository } from 'typeorm';
import { UsuarioPublicacionService } from './usuario-publicacion.service';
import { faker } from '@faker-js/faker';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';

describe('UsuarioPublicacionService', () => {
  let service: UsuarioPublicacionService;
  let usuarioRepository: Repository<UsuarioEntity>;
  let publicacionRepository: Repository<PublicacionEntity>;
  let usuario: UsuarioEntity;
  let publicacionesList: PublicacionEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [UsuarioPublicacionService],
    }).compile();

    service = module.get<UsuarioPublicacionService>(UsuarioPublicacionService);

    usuarioRepository = module.get<Repository<UsuarioEntity>>(getRepositoryToken(UsuarioEntity));
    publicacionRepository = module.get<Repository<PublicacionEntity>>(getRepositoryToken(PublicacionEntity));
    await seedDatabase();
  });

  //Metodo para poblar la base de datos
  const seedDatabase = async () => {
    publicacionRepository.clear();
    usuarioRepository.clear();

    publicacionesList = [];
    for (let i = 0; i < 5; i++) {
      const publicacion: PublicacionEntity = await publicacionRepository.save({
        titulo: faker.lorem.sentence(),
        cuerpo: faker.lorem.paragraph(),
        fechaPublicacion: faker.date.past().toString(),
        imagen: faker.image.avatar()
      })
      publicacionesList.push(publicacion);
    }

    usuario = await usuarioRepository.save({
      cedula: faker.random.numeric(10).toString(),
      nombre: faker.name.firstName(),
      fechaInscripcion: faker.date.past().toString(),
      fechaNacimiento: faker.date.birthdate().toString(),
      imagen: faker.image.avatar(),
      publicaciones: publicacionesList
    });
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });



  //Prueba para el metodo addPublicacionUsuario
  it('addPublicacionUsuario deberia agregar una publicacion a un usuario', async () => {
    const newPublicacion: PublicacionEntity = await publicacionRepository.save({
      titulo: faker.lorem.sentence(),
      cuerpo: faker.lorem.paragraph(),
      fechaPublicacion: faker.date.past().toString(),
      imagen: faker.image.avatar()
    })
    const newUsuario: UsuarioEntity = await usuarioRepository.save({
      cedula: faker.random.numeric(10).toString(),
      nombre: faker.name.firstName(),
      fechaInscripcion: faker.date.past().toString(),
      fechaNacimiento: faker.date.birthdate().toString(),
      imagen: faker.image.avatar()
    })

    const result: UsuarioEntity = await service.addPublicacionUsuario(newUsuario.id, newPublicacion.id);
    expect(result.publicaciones.length).toBe(1);
    expect(result.publicaciones[0]).not.toBeNull();
    expect(result.publicaciones[0].titulo).toBe(newPublicacion.titulo)
    expect(result.publicaciones[0].cuerpo).toBe(newPublicacion.cuerpo)
    expect(result.publicaciones[0].fechaPublicacion).toBe(newPublicacion.fechaPublicacion)
    expect(result.publicaciones[0].imagen).toBe(newPublicacion.imagen)

  });

  //Prueba para el metodo addPublicacionUsuario con una publicacion invalida
  it('addPublicacionUsuario deberia lanzar una excepcion si el usuario no existe', async () => {
    const newUsuario: UsuarioEntity = await usuarioRepository.save({
      cedula: faker.random.numeric(10).toString(),
      nombre: faker.name.firstName(),
      fechaInscripcion: faker.date.past().toString(),
      fechaNacimiento: faker.date.birthdate().toString(),
      imagen: faker.image.avatar()
    })

    await expect(() => service.addPublicacionUsuario(newUsuario.id, "0")).rejects.toHaveProperty("message", "La publicacion con el id dado no fue encontrada");
  });

  //Prueba para el metodo addPublicacionUsuario con un usuario invalido
  it('addPublicacionUsuario deberia lanzar una excepcion si el usuario no existe', async () => {
    const newPublicacion: PublicacionEntity = await publicacionRepository.save({
      titulo: faker.lorem.sentence(),
      cuerpo: faker.lorem.paragraph(),
      fechaPublicacion: faker.date.past().toString(),
      imagen: faker.image.avatar()
    })

    await expect(() => service.addPublicacionUsuario("0", newPublicacion.id)).rejects.toHaveProperty("message", "El usuario con el id dado no fue encontrado");
  });

  //Prueba para el metodo findPublicacionByUsuarioIdPublicacionId
  it('findPublicacionByUsuarioIdPublicacionId deberia retornar una publicacion', async () => {
    const publicacion: PublicacionEntity = publicacionesList[0];
    const storedPublicacion: PublicacionEntity = await service.findPublicacionByUsuarioIdPublicacionId(usuario.id, publicacion.id);
    expect(storedPublicacion).not.toBeNull();
    expect(storedPublicacion.titulo).toBe(publicacion.titulo);
    expect(storedPublicacion.cuerpo).toBe(publicacion.cuerpo);
    expect(storedPublicacion.fechaPublicacion).toBe(publicacion.fechaPublicacion);
    expect(storedPublicacion.imagen).toBe(publicacion.imagen);
  });

  //Prueba para el metodo findPublicacionByUsuarioIdPublicacionId con una publicacion invalida
  it('findPublicacionByUsuarioIdPublicacionId deberia lanzar una excepcion si la publicacion no existe', async () => {
    await expect(() => service.findPublicacionByUsuarioIdPublicacionId(usuario.id, "0")).rejects.toHaveProperty("message", "La publicacion con el id dado no fue encontrada");
  });

  //Prueba para el metodo findPublicacionByUsuarioIdPublicacionId con un usuario invalido
  it('findPublicacionByUsuarioIdPublicacionId deberia lanzar una excepcion si el usuario no existe', async () => {
    const publicacion: PublicacionEntity = publicacionesList[0];
    await expect(() => service.findPublicacionByUsuarioIdPublicacionId("0", publicacion.id)).rejects.toHaveProperty("message", "El usuario con el id dado no fue encontrado");
  });

  //Prueba para el metodo findAllPublicacionesByUsuarioId con una publicacion no asociada a un usuario
  it('findAllPublicacionesByUsuarioId deberia retornar una exceptcion por una publicacion no asociada a un usaurio', async () => {
    const newPublicacion: PublicacionEntity = await publicacionRepository.save({
      titulo: faker.lorem.sentence(),
      cuerpo: faker.lorem.paragraph(),
      fechaPublicacion: faker.date.past().toString(),
      imagen: faker.image.avatar()
    });
    await expect(() => service.findPublicacionByUsuarioIdPublicacionId(usuario.id, newPublicacion.id)).rejects.toHaveProperty("message", "La publicacion con el id dado no esta asociada al usuario");
  });

  //Prueba para el metodo findPublicacionesByUsuarioId
  it('findPublicacionesByUsuarioId deberia retornar todas las publicaciones de un usuario', async () => {
    const publicaciones: PublicacionEntity[] = await service.findPublicacionByUsuarioId(usuario.id);
    expect(publicaciones.length).toBe(5);
  });

  //Prueba para el metodo findpUblicacionesByUsuarioId con un usuario invalido
  it('findPublicacionesByUsuarioId deberia lanzar una excepcion si el usuario no existe', async () => {
    await expect(() => service.findPublicacionByUsuarioId("0")).rejects.toHaveProperty("message", "El usuario con el id dado no fue encontrado");
  });

  //Prueba para el metodo assosiatePublicacionUsuario con update 
  it('assosiatePublicacionUsuario deberia actualizar las publicaciones de un usuario', async () => {
    const newPublicacion: PublicacionEntity = await publicacionRepository.save({
      titulo: faker.lorem.sentence(),
      cuerpo: faker.lorem.paragraph(),
      fechaPublicacion: faker.date.past().toString(),
      imagen: faker.image.avatar()
    });

    const updatedUsuario: UsuarioEntity = await service.associatePublicacionUsuario(usuario.id, [newPublicacion]);
    expect(updatedUsuario.publicaciones.length).toBe(1);

    expect(updatedUsuario.publicaciones[0].titulo).toBe(newPublicacion.titulo);
    expect(updatedUsuario.publicaciones[0].cuerpo).toBe(newPublicacion.cuerpo);
    expect(updatedUsuario.publicaciones[0].fechaPublicacion).toBe(newPublicacion.fechaPublicacion);
    expect(updatedUsuario.publicaciones[0].imagen).toBe(newPublicacion.imagen);
  });

  //Prueba para el metodo assosiatePublicacionUsuario con update con un usario no valido
  it('assosiatePublicacionUsuario deberia lanzar una excepcion si el usuario no existe', async () => {
    const newPublicacion: PublicacionEntity = await publicacionRepository.save({
      titulo: faker.lorem.sentence(),
      cuerpo: faker.lorem.paragraph(),
      fechaPublicacion: faker.date.past().toString(),
      imagen: faker.image.avatar()
    });

    await expect(() => service.associatePublicacionUsuario("0", [newPublicacion])).rejects.toHaveProperty("message", "El usuario con el id dado no fue encontrado");
  });

  //Prueba para el metodo assosiatePublicacionUsuario con update con una publicacion no valida
  it('assosiatePublicacionUsuario deberia lanzar una excepcion si la publicacion no existe', async () => {
    const newPublicacion: PublicacionEntity = publicacionesList[0];
    newPublicacion.id = "0";

    await expect(() => service.associatePublicacionUsuario(usuario.id, [newPublicacion])).rejects.toHaveProperty("message", "La publicacion con el id dado no fue encontrada");
  });

  //Prueba para el método deletePublicacionUsuario
  it('deletePublicacionUsuario deberia eliminar una publicacion de un usuario', async () => {
    const publicacion: PublicacionEntity = publicacionesList[0];

    await service.deletePublicacionUsuario(usuario.id, publicacion.id);

    const storedUsuario: UsuarioEntity = await usuarioRepository.findOne({ where: { id: usuario.id }, relations: ['publicaciones'] });
    const deletedPublicacion: PublicacionEntity = storedUsuario.publicaciones.find((p) => p.id === publicacion.id);

    expect(deletedPublicacion).toBeUndefined();
  });

  //Prueba para el método deletePublicacionUsuario con una publicacion no valida
  it('deletePublicacionUsuario deberia lanzar una excepcion si la publicacion no existe', async () => {
    await expect(() => service.deletePublicacionUsuario(usuario.id, "0")).rejects.toHaveProperty("message", "La publicacion con el id dado no fue encontrada");
  });

  //Prueba para el método deletePublicacionUsuario con un usuario no valido
  it('deletePublicacionUsuario deberia lanzar una excepcion si el usuario no existe', async () => {
    const publicacion: PublicacionEntity = publicacionesList[0];
    await expect(() => service.deletePublicacionUsuario("0", publicacion.id)).rejects.toHaveProperty("message", "El usuario con el id dado no fue encontrado");
  });

  //Prueba para el método deletePublicacionUsuario con una publicacion no asociada a un usuario
  it('deletePublicacionUsuario deberia lanzar una excepcion si la publicacion no está asociada al usuario', async () => {
    const newPublicacion: PublicacionEntity = await publicacionRepository.save({
      titulo: faker.lorem.sentence(),
      cuerpo: faker.lorem.paragraph(),
      fechaPublicacion: faker.date.past().toString(),
      imagen: faker.image.avatar()
    });
    await expect(() => service.deletePublicacionUsuario(usuario.id, newPublicacion.id)).rejects.toHaveProperty("message", "La publicacion con el id dado no esta asociada al usuario");
  });
});

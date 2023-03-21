import { Test, TestingModule } from '@nestjs/testing';
import { PedidoEntity } from '../pedido/pedido.entity';
import { UsuarioEntity } from '../usuario/usuario.entity';
import { Repository } from 'typeorm';
import { UsuarioPedidoService } from './usuario-pedido.service';
import { faker } from '@faker-js/faker';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';

describe('UsuarioPedidoService', () => {
  let service: UsuarioPedidoService;
  let usuarioRepository: Repository<UsuarioEntity>;
  let pedidoRepository: Repository<PedidoEntity>;
  let usuario: UsuarioEntity;
  let pedidosList: PedidoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [UsuarioPedidoService],
    }).compile();

    service = module.get<UsuarioPedidoService>(UsuarioPedidoService);

    usuarioRepository = module.get<Repository<UsuarioEntity>>(
      getRepositoryToken(UsuarioEntity),
    );
    pedidoRepository = module.get<Repository<PedidoEntity>>(
      getRepositoryToken(PedidoEntity),
    );
    await seedDatabase();
  });

  //Metodo para poblar la base de datos
  const seedDatabase = async () => {
    pedidoRepository.clear();
    usuarioRepository.clear();

    pedidosList = [];
    for (let i = 0; i < 5; i++) {
      const pedido: PedidoEntity = await pedidoRepository.save({
        fecha: faker.date.past().toISOString(),
        monto: faker.datatype.number(),
        estado: faker.datatype.string(),
      });
      pedidosList.push(pedido);
    }

    usuario = await usuarioRepository.save({
      cedula: faker.random.numeric(10).toString(),
      nombre: faker.name.firstName(),
      fechaInscripcion: faker.date.past().toString(),
      fechaNacimiento: faker.date.birthdate().toString(),
      imagen: faker.image.avatar(),
      pedidos: pedidosList,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  //Prueba para el metodo addPedidoUsuario
  it('addPedidoUsuario deberia agregar una pedido a un usuario', async () => {
    const newPedido: PedidoEntity = await pedidoRepository.save({
      fecha: faker.date.past().toISOString(),
      monto: faker.datatype.number(),
      estado: faker.datatype.string(),
    });
    const newUsuario: UsuarioEntity = await usuarioRepository.save({
      cedula: faker.random.numeric(10).toString(),
      nombre: faker.name.firstName(),
      fechaInscripcion: faker.date.past().toString(),
      fechaNacimiento: faker.date.birthdate().toString(),
      imagen: faker.image.avatar(),
    });

    const result: UsuarioEntity = await service.addPedidoUsuario(
      newUsuario.id,
      newPedido.id,
    );
    expect(result.pedidos.length).toBe(1);
    expect(result.pedidos[0]).not.toBeNull();
    expect(result.pedidos[0].fecha).toBe(newPedido.fecha);
    expect(result.pedidos[0].monto).toBe(newPedido.monto);
    expect(result.pedidos[0].estado).toBe(newPedido.estado);
  });

  //Prueba para el metodo addPedidoUsuario con un pedido invalido
  it('addPedidoUsuario deberia lanzar una excepcion si el usuario no existe', async () => {
    const newUsuario: UsuarioEntity = await usuarioRepository.save({
      cedula: faker.random.numeric(10).toString(),
      nombre: faker.name.firstName(),
      fechaInscripcion: faker.date.past().toString(),
      fechaNacimiento: faker.date.birthdate().toString(),
      imagen: faker.image.avatar(),
    });

    await expect(() =>
      service.addPedidoUsuario(newUsuario.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'El pedido con el id dado no fue encontrado',
    );
  });

  //Prueba para el metodo addPedidoUsuario con un usuario invalido
  it('addPedidoUsuario deberia lanzar una excepcion si el usuario no existe', async () => {
    const newPedido: PedidoEntity = await pedidoRepository.save({
      fecha: faker.date.past().toISOString(),
      monto: faker.datatype.number(),
      estado: faker.datatype.string(),
    });

    await expect(() =>
      service.addPedidoUsuario('0', newPedido.id),
    ).rejects.toHaveProperty(
      'message',
      'El usuario con el id dado no fue encontrado',
    );
  });

  //Prueba para el metodo findPedidoByUsuarioIdPedidoId
  it('findPedidoByUsuarioIdPedidoId deberia retornar un pedido', async () => {
    const pedido: PedidoEntity = pedidosList[0];
    const storedPedido: PedidoEntity =
      await service.findPedidoByUsuarioIdPedidoId(usuario.id, pedido.id);
    expect(storedPedido).not.toBeNull();
    expect(storedPedido.fecha).toBe(pedido.fecha);
    expect(storedPedido.estado).toBe(pedido.estado);
    expect(storedPedido.monto).toBe(pedido.monto);
  });

  //Prueba para el metodo findPedidoByUsuarioIdPedidoId con un pedido invalida
  it('findPedidoByUsuarioIdPedidoId deberia lanzar una excepcion si el pedido no existe', async () => {
    await expect(() =>
      service.findPedidoByUsuarioIdPedidoId(usuario.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'El pedido con el id dado no fue encontrado',
    );
  });

  //Prueba para el metodo findPedidoByUsuarioIdPedidoId con un usuario invalido
  it('findPedidoByUsuarioIdPedidoId deberia lanzar una excepcion si el usuario no existe', async () => {
    const pedido: PedidoEntity = pedidosList[0];
    await expect(() =>
      service.findPedidoByUsuarioIdPedidoId('0', pedido.id),
    ).rejects.toHaveProperty(
      'message',
      'El usuario con el id dado no fue encontrado',
    );
  });

  //Prueba para el metodo findAllPedidoesByUsuarioId con un pedido no asociado a un usuario
  it('findAllPedidoesByUsuarioId deberia retornar una exceptcion por un pedido no asociado a un usaurio', async () => {
    const newPedido: PedidoEntity = await pedidoRepository.save({
      fecha: faker.date.past().toISOString(),
      monto: faker.datatype.number(),
      estado: faker.datatype.string(),
    });
    await expect(() =>
      service.findPedidoByUsuarioIdPedidoId(usuario.id, newPedido.id),
    ).rejects.toHaveProperty(
      'message',
      'El pedido con el id dado no esta asociado al usuario',
    );
  });

  //Prueba para el metodo findPedidoesByUsuarioId
  it('findPedidoesByUsuarioId deberia retornar todas los pedidos de un usuario', async () => {
    const pedidos: PedidoEntity[] = await service.findPedidoByUsuarioId(
      usuario.id,
    );
    expect(pedidos.length).toBe(5);
  });

  //Prueba para el metodo findpUblicacionesByUsuarioId con un usuario invalido
  it('findPedidoesByUsuarioId deberia lanzar una excepcion si el usuario no existe', async () => {
    await expect(() =>
      service.findPedidoByUsuarioId('0'),
    ).rejects.toHaveProperty(
      'message',
      'El usuario con el id dado no fue encontrado',
    );
  });

  //Prueba para el metodo assosiatePedidoUsuario con update
  it('assosiatePedidoUsuario deberia actualizar los pedidos de un usuario', async () => {
    const newPedido: PedidoEntity = await pedidoRepository.save({
      fecha: faker.date.past().toISOString(),
      monto: faker.datatype.number(),
      estado: faker.datatype.string(),
    });

    const updatedUsuario: UsuarioEntity = await service.associatePedidoUsuario(
      usuario.id,
      [newPedido],
    );
    expect(updatedUsuario.pedidos.length).toBe(1);

    expect(updatedUsuario.pedidos[0].fecha).toBe(newPedido.fecha);
    expect(updatedUsuario.pedidos[0].monto).toBe(newPedido.monto);
    expect(updatedUsuario.pedidos[0].estado).toBe(newPedido.estado);
  });

  //Prueba para el metodo assosiatePedidoUsuario con update con un usario no valido
  it('assosiatePedidoUsuario deberia lanzar una excepcion si el usuario no existe', async () => {
    const newPedido: PedidoEntity = await pedidoRepository.save({
      fecha: faker.date.past().toISOString(),
      monto: faker.datatype.number(),
      estado: faker.datatype.string(),
    });

    await expect(() =>
      service.associatePedidoUsuario('0', [newPedido]),
    ).rejects.toHaveProperty(
      'message',
      'El usuario con el id dado no fue encontrado',
    );
  });

  //Prueba para el metodo assosiatePedidoUsuario con update con una pedido no valida
  it('assosiatePedidoUsuario deberia lanzar una excepcion si el pedido no existe', async () => {
    const newPedido: PedidoEntity = pedidosList[0];
    newPedido.id = '0';

    await expect(() =>
      service.associatePedidoUsuario(usuario.id, [newPedido]),
    ).rejects.toHaveProperty(
      'message',
      'El pedido con el id dado no fue encontrado',
    );
  });

  //Prueba para el método deletePedidoUsuario
  it('deletePedidoUsuario deberia eliminar un pedido de un usuario', async () => {
    const pedido: PedidoEntity = pedidosList[0];

    await service.deletePedidoUsuario(usuario.id, pedido.id);

    const storedUsuario: UsuarioEntity = await usuarioRepository.findOne({
      where: { id: usuario.id },
      relations: ['pedidos'],
    });
    const deletedPedido: PedidoEntity = storedUsuario.pedidos.find(
      (p) => p.id === pedido.id,
    );

    expect(deletedPedido).toBeUndefined();
  });

  //Prueba para el método deletePedidoUsuario con un pedido no valida
  it('deletePedidoUsuario deberia lanzar una excepcion si la pedido no existe', async () => {
    await expect(() =>
      service.deletePedidoUsuario(usuario.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'El pedido con el id dado no fue encontrado',
    );
  });

  //Prueba para el método deletePedidoUsuario con un usuario no valido
  it('deletePedidoUsuario deberia lanzar una excepcion si el usuario no existe', async () => {
    const pedido: PedidoEntity = pedidosList[0];
    await expect(() =>
      service.deletePedidoUsuario('0', pedido.id),
    ).rejects.toHaveProperty(
      'message',
      'El usuario con el id dado no fue encontrado',
    );
  });

  //Prueba para el método deletePedidoUsuario con un pedido no asociado a un usuario
  it('deletePedidoUsuario deberia lanzar una excepcion si el pedido no está asociado al usuario', async () => {
    const newPedido: PedidoEntity = await pedidoRepository.save({
      fecha: faker.date.past().toISOString(),
      monto: faker.datatype.number(),
      estado: faker.datatype.string(),
    });
    await expect(() =>
      service.deletePedidoUsuario(usuario.id, newPedido.id),
    ).rejects.toHaveProperty(
      'message',
      'El pedido con el id dado no esta asociado al usuario',
    );
  });
});

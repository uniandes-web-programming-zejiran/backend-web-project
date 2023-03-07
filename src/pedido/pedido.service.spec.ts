import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { PedidoEntity } from './pedido.entity';
import { PedidoService } from './pedido.service';
import { faker } from '@faker-js/faker';
import { UsuarioEntity } from 'src/usuario/usuario.entity';

describe('PedidoService', () => {
  let service: PedidoService;
  let repository: Repository<PedidoEntity>;
  let pedidosList: PedidoEntity[];

  // Configuracion de la base de datos
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PedidoService],
    }).compile();

    service = module.get<PedidoService>(PedidoService);
    repository = module.get<Repository<PedidoEntity>>(
      getRepositoryToken(PedidoEntity),
    );
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  //Metodo para poblar la base de datos
  const seedDatabase = async () => {
    repository.clear();
    pedidosList = [];
    for (let i = 0; i < 5; i++) {
      const pedido: PedidoEntity = await repository.save({
        fecha: faker.date.past().toISOString(),
        monto: faker.datatype.number(),
        estado: faker.datatype.string(),
      });
      pedidosList.push(pedido);
    }
  };

  //Prueba para el metodo findAll
  it('findAll deberia retornar el listado de pedidos', async () => {
    const pedidos: PedidoEntity[] = await service.findAll();
    expect(pedidos).not.toBeNull();
    expect(pedidos).toHaveLength(pedidosList.length);
  });

  //Prueba para el metodo findOne
  it('findOne deberia retornar un pedido por id', async () => {
    const storedPedido: PedidoEntity = pedidosList[0];
    const pedido: PedidoEntity = await service.findOne(storedPedido.id);
    expect(pedido).not.toBeNull();
    expect(pedido.fecha).toEqual(storedPedido.fecha);
    expect(pedido.monto).toEqual(storedPedido.monto);
    expect(pedido.estado).toEqual(storedPedido.estado);
    
  });

  //Prueba metodo findOne con cedula inexistente
  it('findOne deberia retornar exception para un pedido no valido', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'El pedido con el id dado no fue encontrado',
    );
  });

  //Prueba para el metodo create
  it('create deberia crear un pedido', async () => {
    const pedido: PedidoEntity = {
        id: '',
        fecha: faker.date.past().toISOString(),
        monto: faker.datatype.number(),
        estado: faker.datatype.string(),
        productos: [],
        usuario: new UsuarioEntity(),
        //Revisar la relacion con pago
        pago: null,
    };
    const newPedido: PedidoEntity = await service.create(pedido);
    expect(newPedido).not.toBeNull();

    const storedPedido: PedidoEntity = await repository.findOne({
      where: { id: newPedido.id },
    });
    expect(storedPedido).not.toBeNull();
    expect(storedPedido.fecha).toEqual(storedPedido.fecha);
    expect(storedPedido.monto).toEqual(storedPedido.monto);
    expect(storedPedido.estado).toEqual(storedPedido.estado);
  });

  //Prueba para el metodo update
  it('update deberia actualizar un pedido', async () => {
    const pedido: PedidoEntity = pedidosList[0];
    pedido.fecha = faker.date.past().toISOString();
    pedido.monto = faker.datatype.number();
    pedido.estado = faker.datatype.string();

    const updatedPedido: PedidoEntity = await service.update(
      pedido.id,
      pedido,
    );
    expect(updatedPedido).not.toBeNull();
    const storedPedido: PedidoEntity = await repository.findOne({
      where: { id: pedido.id },
    });
    expect(storedPedido).not.toBeNull();
    expect(storedPedido.fecha).toEqual(storedPedido.fecha);
    expect(storedPedido.monto).toEqual(storedPedido.monto);
    expect(storedPedido.estado).toEqual(storedPedido.estado);
  });

  //Prueba para el metodo update con pedido inexistente
  it('update deberia retornar exception para un pedido no valido', async () => {
    let pedido: PedidoEntity = pedidosList[0];
    pedido = {
      ...pedido,
        fecha: faker.date.past().toISOString(),
        monto: faker.datatype.number(),
        estado: faker.datatype.string(),
    };
    expect(() => service.update('0', pedido)).rejects.toHaveProperty(
      'message',
      'El pedido con el id dado no fue encontrado',
    );
  });

  //Prueba para el metodo delete
  it('delete deberia eliminar un pedido', async () => {
    const pedido: PedidoEntity = pedidosList[0];
    await service.delete(pedido.id);
    const deletedPedido: PedidoEntity = await repository.findOne({
      where: { id: pedido.id },
    });
    expect(deletedPedido).toBeNull();
  });

  //Prueba para el metodo delete con cedula inexistente
  it('delete deberia retornar exception para un pedido no valido', async () => {
    const pedido: PedidoEntity = pedidosList[0];
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'El pedido con el id dado no fue encontrado',
    );
  });
});

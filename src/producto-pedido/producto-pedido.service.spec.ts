import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { ProductoEntity } from '../producto/producto.entity';
import { PedidoEntity } from '../pedido/pedido.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { ProductoPedidoService } from './producto-pedido.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('ProductoPedidoService', () => {
  let service: ProductoPedidoService;
  let productoRepository: Repository<ProductoEntity>;
  let pedidoRepository: Repository<PedidoEntity>;
  let pedido: PedidoEntity;
  let productosList: ProductoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ProductoPedidoService],
    }).compile();

    service = module.get<ProductoPedidoService>(ProductoPedidoService);
    productoRepository = module.get<Repository<ProductoEntity>>(
      getRepositoryToken(ProductoEntity),
    );
    pedidoRepository = module.get<Repository<PedidoEntity>>(
      getRepositoryToken(PedidoEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    pedidoRepository.clear();
    productoRepository.clear();

    productosList = [];
    for (let i = 0; i < 5; i++) {
      const producto: ProductoEntity = await productoRepository.save({
        nombre: faker.name.firstName(),
        precio: faker.datatype.number(),
        stock: faker.datatype.number(),
        categoria: faker.lorem.sentence(),
        imagen: faker.image.imageUrl(),
      });
      productosList.push(producto);
    }

    pedido = await pedidoRepository.save({
      fecha: faker.date.past().toISOString(),
      monto: faker.datatype.number(),
      estado: faker.datatype.string(),
      productos: productosList,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addPedidoProducto should add producto to pedido', async () => {
    const newPedido: PedidoEntity = await pedidoRepository.save({
      fecha: faker.date.past().toISOString(),
      monto: faker.datatype.number(),
      estado: faker.datatype.string(),
    });

    const newProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.name.firstName(),
      precio: faker.datatype.number(),
      stock: faker.datatype.number(),
      categoria: faker.lorem.sentence(),
      imagen: faker.image.imageUrl(),
    });

    const result: PedidoEntity = await service.addProductoPedido(
      newProducto.id,
      newPedido.id,
    );

    expect(result.productos).not.toBeNull();
    expect(result.productos[0].nombre).toBe(newProducto.nombre);
    expect(result.productos[0].precio).toBe(newProducto.precio);
    expect(result.productos[0].stock).toBe(newProducto.stock);
    expect(result.productos[0].categoria).toBe(newProducto.categoria);
    expect(result.productos[0].imagen).toBe(newProducto.imagen);
  });

  it('addPedidoProducto should thrown exception for an invalid pedido', async () => {
    const newProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.name.firstName(),
      precio: faker.datatype.number(),
      stock: faker.datatype.number(),
      categoria: faker.lorem.sentence(),
      imagen: faker.image.imageUrl(),
    });

    await expect(() =>
      service.addProductoPedido(newProducto.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'El pedido con el id dado no fue encontrado',
    );
  });

  it('addPedidoProducto should throw an exception for an invalid pedido', async () => {
    const newPedido: PedidoEntity = await pedidoRepository.save({
      fecha: faker.date.past().toISOString(),
      monto: faker.datatype.number(),
      estado: faker.datatype.string(),
    });

    await expect(() =>
      service.addProductoPedido('0', newPedido.id),
    ).rejects.toHaveProperty(
      'message',
      'The producto with the given id was not found',
    );
  });

  it('findProductoByPedidoIdProductoId should return producto by pedido', async () => {
    const producto: ProductoEntity = productosList[0];
    const storedProducto: ProductoEntity =
      await service.findProductoByPedidoIdProductoId(producto.id, pedido.id);
    expect(storedProducto).not.toBeNull();
    expect(storedProducto.nombre).toBe(producto.nombre);
    expect(storedProducto.precio).toBe(producto.precio);
    expect(storedProducto.stock).toBe(producto.stock);
    expect(storedProducto.categoria).toBe(producto.categoria);
    expect(storedProducto.imagen).toBe(producto.imagen);
  });

  it('findProductoByPedidoIdProductoId should throw an exception for an invalid pedido', async () => {
    const producto: ProductoEntity = productosList[0];
    await expect(() =>
      service.findProductoByPedidoIdProductoId(producto.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'El pedido con el id dado no fue encontrado',
    );
  });

  it('findProductoByPedidoIdProductoId should throw an exception for an invalid producto', async () => {
    await expect(() =>
      service.findProductoByPedidoIdProductoId('0', pedido.id),
    ).rejects.toHaveProperty(
      'message',
      'The producto with the given id was not found',
    );
  });

  it('findProductoByPedidoIdProductoId should throw an exception for a producto not associated to the pedido', async () => {
    const newProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.name.firstName(),
      precio: faker.datatype.number(),
      stock: faker.datatype.number(),
      categoria: faker.lorem.sentence(),
      imagen: faker.image.imageUrl(),
    });

    await expect(() =>
      service.findProductoByPedidoIdProductoId(newProducto.id, pedido.id),
    ).rejects.toHaveProperty(
      'message',
      'El producto con el id dado no está asociado al pedido',
    );
  });

  it('findProductosByPedidoId should return productos by pedido', async () => {
    const productos: ProductoEntity[] = await service.findProductosByPedidoId(
      pedido.id,
    );
    expect(productos.length).toBe(5);
  });

  it('findProductosByPedidoId should throw an exception for an invalid pedido', async () => {
    await expect(() =>
      service.findProductosByPedidoId('0'),
    ).rejects.toHaveProperty(
      'message',
      'El pedido con el id dado no fue encontrado',
    );
  });

  it('associateProductosPedido should update productos list for a pedido', async () => {
    const newProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.name.firstName(),
      precio: faker.datatype.number(),
      stock: faker.datatype.number(),
      categoria: faker.lorem.sentence(),
      imagen: faker.image.imageUrl(),
    });

    const updatedPedido: PedidoEntity = await service.associateProductosPedido(
      pedido.id,
      [newProducto],
    );
    expect(updatedPedido.productos.length).toBe(1);
    expect(updatedPedido.productos[0].nombre).toBe(newProducto.nombre);
    expect(updatedPedido.productos[0].precio).toBe(newProducto.precio);
    expect(updatedPedido.productos[0].stock).toBe(newProducto.stock);
    expect(updatedPedido.productos[0].categoria).toBe(newProducto.categoria);
    expect(updatedPedido.productos[0].imagen).toBe(newProducto.imagen);
  });

  it('associateProductosPedido should throw an exception for an invalid pedido', async () => {
    const newProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.company.companyName(),
      precio: faker.datatype.number(),
      stock: faker.datatype.number(),
      categoria: faker.lorem.sentence(),
      imagen: faker.image.imageUrl(),
    });

    await expect(() =>
      service.associateProductosPedido('0', [newProducto]),
    ).rejects.toHaveProperty(
      'message',
      'El pedido con el id dado no fue encontrado',
    );
  });

  it('associateProductosPedido should throw an exception for an invalid producto', async () => {
    const newProducto: ProductoEntity = productosList[0];
    newProducto.id = '0';

    await expect(() =>
      service.associateProductosPedido(pedido.id, [newProducto]),
    ).rejects.toHaveProperty(
      'message',
      'The producto with the given id was not found',
    );
  });

  it('deletePedidoToProducto should remove a producto from a pedido', async () => {
    const producto: ProductoEntity = productosList[0];

    await service.deleteProductoPedido(producto.id, pedido.id);

    const storedPedido: PedidoEntity = await pedidoRepository.findOne({
      where: { id: pedido.id },
      relations: ['productos'],
    });
    const deletedProducto: ProductoEntity = storedPedido.productos.find(
      (a) => a.id === producto.id,
    );

    expect(deletedProducto).toBeUndefined();
  });

  it('deletePedidoToProducto should thrown an exception for an invalid producto', async () => {
    await expect(() =>
      service.deleteProductoPedido('0', pedido.id),
    ).rejects.toHaveProperty(
      'message',
      'The producto with the given id was not found',
    );
  });

  it('deletePedidoToProducto should thrown an exception for an invalid pedido', async () => {
    const producto: ProductoEntity = productosList[0];
    await expect(() =>
      service.deleteProductoPedido(producto.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'El pedido con el id dado no fue encontrado',
    );
  });

  it('deletePedidoToProducto should thrown an exception for an non asocciated producto', async () => {
    const newProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.company.companyName(),
      precio: faker.datatype.number(),
      stock: faker.datatype.number(),
      categoria: faker.lorem.sentence(),
      imagen: faker.image.imageUrl(),
    });

    await expect(() =>
      service.deleteProductoPedido(newProducto.id, pedido.id),
    ).rejects.toHaveProperty(
      'message',
      'El producto con el id dado no está asociado al pedido',
    );
  });
});

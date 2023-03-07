import { Test, TestingModule } from '@nestjs/testing';
import { ProductoEntity } from '../producto/producto.entity';
import { Repository } from 'typeorm';
import { NegocioEntity } from '../negocio/negocio.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { NegocioProductoService } from './negocio-producto.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('NegocioProductoService', () => {
  let service: NegocioProductoService;
  let negocioRepository: Repository<NegocioEntity>;
  let productoRepository: Repository<ProductoEntity>;
  let negocio: NegocioEntity;
  let productosList: ProductoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [NegocioProductoService],
    }).compile();

    service = module.get<NegocioProductoService>(NegocioProductoService);
    negocioRepository = module.get<Repository<NegocioEntity>>(
      getRepositoryToken(NegocioEntity),
    );
    productoRepository = module.get<Repository<ProductoEntity>>(
      getRepositoryToken(ProductoEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    productoRepository.clear();
    negocioRepository.clear();

    productosList = [];
    for (let i = 0; i < 5; i++) {
      const producto: ProductoEntity = await productoRepository.save({
        nombre: faker.company.companyName(),
        precio: faker.datatype.number(),
        stock: faker.datatype.number(),
        categoria: faker.lorem.sentence(),
        imagen: faker.image.imageUrl(),
      });
      productosList.push(producto);
    }

    negocio = await negocioRepository.save({
      nombre: faker.company.companyName(),
      tipo: faker.lorem.sentence(),
      ubicacion: faker.lorem.sentence(),
      fechaCreacion: faker.lorem.sentence(),
      imagen: faker.image.imageUrl(),
      productos: productosList,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addProductoNegocio should add an producto to a negocio', async () => {
    const newProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.company.companyName(),
      precio: faker.datatype.number(),
      stock: faker.datatype.number(),
      categoria: faker.lorem.sentence(),
      imagen: faker.image.imageUrl(),
    });

    const newNegocio: NegocioEntity = await negocioRepository.save({
      nombre: faker.company.companyName(),
      tipo: faker.lorem.sentence(),
      ubicacion: faker.lorem.sentence(),
      fechaCreacion: faker.lorem.sentence(),
      imagen: faker.image.imageUrl(),
    });

    const result: NegocioEntity = await service.addProductoNegocio(
      newNegocio.id,
      newProducto.id,
    );

    expect(result.productos.length).toBe(1);
    expect(result.productos[0]).not.toBeNull();
    expect(result.productos[0].nombre).toBe(newProducto.nombre);
    expect(result.productos[0].precio).toBe(newProducto.precio);
    expect(result.productos[0].stock).toBe(newProducto.stock);
    expect(result.productos[0].categoria).toBe(newProducto.categoria);
    expect(result.productos[0].imagen).toBe(newProducto.imagen);
  });

  it('addProductoNegocio should thrown exception for an invalid producto', async () => {
    const newNegocio: NegocioEntity = await negocioRepository.save({
      nombre: faker.company.companyName(),
      tipo: faker.lorem.sentence(),
      ubicacion: faker.lorem.sentence(),
      fechaCreacion: faker.lorem.sentence(),
      imagen: faker.image.imageUrl(),
    });

    await expect(() =>
      service.addProductoNegocio(newNegocio.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'El producto con el id dado no fue encontrado',
    );
  });

  it('addProductoNegocio should throw an exception for an invalid negocio', async () => {
    const newProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.company.companyName(),
      precio: faker.datatype.number(),
      stock: faker.datatype.number(),
      categoria: faker.lorem.sentence(),
      imagen: faker.image.imageUrl(),
    });

    await expect(() =>
      service.addProductoNegocio('0', newProducto.id),
    ).rejects.toHaveProperty(
      'message',
      'El negocio con el id dado no fue encontrado',
    );
  });

  it('findProductoByNegocioIdProductoId should return producto by negocio', async () => {
    const producto: ProductoEntity = productosList[0];
    const storedProducto: ProductoEntity =
      await service.findProductoByNegocioIdProductoId(negocio.id, producto.id);
    expect(storedProducto).not.toBeNull();
    expect(storedProducto.nombre).toBe(producto.nombre);
    expect(storedProducto.precio).toBe(producto.precio);
    expect(storedProducto.stock).toBe(producto.stock);
    expect(storedProducto.categoria).toBe(producto.categoria);
    expect(storedProducto.imagen).toBe(producto.imagen);
  });

  it('findProductoByNegocioIdProductoId should throw an exception for an invalid producto', async () => {
    await expect(() =>
      service.findProductoByNegocioIdProductoId(negocio.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'El producto con el id dado no fue encontrado',
    );
  });

  it('findProductoByNegocioIdProductoId should throw an exception for an invalid negocio', async () => {
    const producto: ProductoEntity = productosList[0];
    await expect(() =>
      service.findProductoByNegocioIdProductoId('0', producto.id),
    ).rejects.toHaveProperty(
      'message',
      'El negocio con el id dado no fue encontrado',
    );
  });

  it('findProductoByNegocioIdProductoId should throw an exception for an producto not associated to the negocio', async () => {
    const newProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.company.companyName(),
      precio: faker.datatype.number(),
      stock: faker.datatype.number(),
      categoria: faker.lorem.sentence(),
      imagen: faker.image.imageUrl(),
    });

    await expect(() =>
      service.findProductoByNegocioIdProductoId(negocio.id, newProducto.id),
    ).rejects.toHaveProperty(
      'message',
      'El producto con el id dado no esta asociado al negocio',
    );
  });

  it('findProductosByNegocioId should return productos by negocio', async () => {
    const productos: ProductoEntity[] = await service.findProductosByNegocioId(
      negocio.id,
    );
    expect(productos.length).toBe(5);
  });

  it('findProductosByNegocioId should throw an exception for an invalid negocio', async () => {
    await expect(() =>
      service.findProductosByNegocioId('0'),
    ).rejects.toHaveProperty(
      'message',
      'El negocio con el id dado no fue encontrado',
    );
  });

  it('associateProductosNegocio should update productos list for a negocio', async () => {
    const newProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.company.companyName(),
      precio: faker.datatype.number(),
      stock: faker.datatype.number(),
      categoria: faker.lorem.sentence(),
      imagen: faker.image.imageUrl(),
    });

    const updatedNegocio: NegocioEntity =
      await service.associateProductosNegocio(negocio.id, [newProducto]);
    expect(updatedNegocio.productos.length).toBe(1);

    expect(updatedNegocio.productos[0].nombre).toBe(newProducto.nombre);
    expect(updatedNegocio.productos[0].precio).toBe(newProducto.precio);
    expect(updatedNegocio.productos[0].stock).toBe(newProducto.stock);
    expect(updatedNegocio.productos[0].categoria).toBe(newProducto.categoria);
    expect(updatedNegocio.productos[0].imagen).toBe(newProducto.imagen);
  });

  it('associateProductosNegocio should throw an exception for an invalid negocio', async () => {
    const newProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.company.companyName(),
      precio: faker.datatype.number(),
      stock: faker.datatype.number(),
      categoria: faker.lorem.sentence(),
      imagen: faker.image.imageUrl(),
    });

    await expect(() =>
      service.associateProductosNegocio('0', [newProducto]),
    ).rejects.toHaveProperty(
      'message',
      'El negocio con el id dado no fue encontrado',
    );
  });

  it('associateProductosNegocio should throw an exception for an invalid producto', async () => {
    const newProducto: ProductoEntity = productosList[0];
    newProducto.id = '0';

    await expect(() =>
      service.associateProductosNegocio(negocio.id, [newProducto]),
    ).rejects.toHaveProperty(
      'message',
      'El producto con el id dado no fue encontrado',
    );
  });

  it('deleteProductoToNegocio should remove an producto from a negocio', async () => {
    const producto: ProductoEntity = productosList[0];

    await service.deleteProductoNegocio(negocio.id, producto.id);

    const storedNegocio: NegocioEntity = await negocioRepository.findOne({
      where: { id: negocio.id },
      relations: ['productos'],
    });
    const deletedProducto: ProductoEntity = storedNegocio.productos.find(
      (a) => a.id === producto.id,
    );

    expect(deletedProducto).toBeUndefined();
  });

  it('deleteProductoToNegocio should thrown an exception for an invalid producto', async () => {
    await expect(() =>
      service.deleteProductoNegocio(negocio.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'El producto con el id dado no fue encontrado',
    );
  });

  it('deleteProductoToNegocio should thrown an exception for an invalid negocio', async () => {
    const producto: ProductoEntity = productosList[0];
    await expect(() =>
      service.deleteProductoNegocio('0', producto.id),
    ).rejects.toHaveProperty(
      'message',
      'El negocio con el id dado no fue encontrado',
    );
  });

  it('deleteProductoToNegocio should thrown an exception for an non asocciated producto', async () => {
    const newProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.company.companyName(),
      precio: faker.datatype.number(),
      stock: faker.datatype.number(),
      categoria: faker.lorem.sentence(),
      imagen: faker.image.imageUrl(),
    });

    await expect(() =>
      service.deleteProductoNegocio(negocio.id, newProducto.id),
    ).rejects.toHaveProperty(
      'message',
      'El producto con el id dado no esta asociado al negocio',
    );
  });
});

/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { ProductoEntity } from './producto.entity';
import { ProductoService } from './producto.service';

import { faker } from '@faker-js/faker';

describe('ProductoService', () => {
  let service: ProductoService;
  let repository: Repository<ProductoEntity>;
  let productosList: ProductoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ProductoService],
    }).compile();

    service = module.get<ProductoService>(ProductoService);
    repository = module.get<Repository<ProductoEntity>>(getRepositoryToken(ProductoEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    productosList = [];
    for(let i = 0; i < 5; i++){
        const producto: ProductoEntity = await repository.save({
        nombre: faker.company.companyName(), 
        precio: faker.datatype.number(), 
        stock: faker.datatype.number(), 
        categoria: faker.lorem.sentence(), 
        imagen: faker.image.imageUrl()})
        productosList.push(producto);
    }
  }
    
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll deberia retornar todos los productos', async () => {
    const productos: ProductoEntity[] = await service.findAll();
    expect(productos).not.toBeNull();
    expect(productos).toHaveLength(productosList.length);
  });

  it('findOne deberia retornar el producto por id', async () => {
    const storedProducto: ProductoEntity = productosList[0];
    const producto: ProductoEntity = await service.findOne(storedProducto.id);
    expect(producto).not.toBeNull();
    expect(producto.nombre).toEqual(storedProducto.nombre)
    expect(producto.precio).toEqual(storedProducto.precio)
    expect(producto.stock).toEqual(storedProducto.stock)
    expect(producto.categoria).toEqual(storedProducto.categoria)
    expect(producto.imagen).toEqual(storedProducto.imagen)
  });

  it('findOne deberia mandar exception para un producto invalido', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "El producto con el id dado no fue encontrado")
  });

  it('create deberia retornar un producto', async () => {
    const producto: ProductoEntity = {
      id: "",
      nombre: faker.company.companyName(),
      precio: faker.datatype.number(),
      stock: faker.datatype.number(),
      categoria: faker.lorem.sentence(),
      imagen: faker.image.imageUrl(),
      reviews: [],
      pedidos: [],
      negocio: null
    }

    const newProducto: ProductoEntity = await service.create(producto);
    expect(newProducto).not.toBeNull();

    const storedProducto: ProductoEntity = await repository.findOne({where: {id: newProducto.id}})
    expect(storedProducto).not.toBeNull();
    expect(storedProducto.nombre).toEqual(newProducto.nombre)
    expect(storedProducto.precio).toEqual(newProducto.precio)
    expect(storedProducto.stock).toEqual(newProducto.stock)
    expect(storedProducto.categoria).toEqual(newProducto.categoria)
    expect(storedProducto.imagen).toEqual(newProducto.imagen)
  });

  it('update deberia modificar un producto', async () => {
    const producto: ProductoEntity = productosList[0];
    producto.nombre = "Nuevo nombre";
  
    const updatedProducto: ProductoEntity = await service.update(producto.id, producto);
    expect(updatedProducto).not.toBeNull();
  
    const storedProducto: ProductoEntity = await repository.findOne({ where: { id: producto.id } })
    expect(storedProducto).not.toBeNull();
    expect(storedProducto.nombre).toEqual(producto.nombre)
  });
 
  it('update deberia mandar exception si el producto no es valido', async () => {
    let producto: ProductoEntity = productosList[0];
    producto = {
      ...producto, nombre: "Nuevo Nombre"
    }
    await expect(() => service.update("0", producto)).rejects.toHaveProperty("message", "El producto con el id dado no fue encontrado")
  });

  it('delete deberia remover un producto', async () => {
    const producto: ProductoEntity = productosList[0];
    await service.delete(producto.id);
  
    const deletedProducto: ProductoEntity = await repository.findOne({ where: { id: producto.id } })
    expect(deletedProducto).toBeNull();
  });

  it('delete deberia mandar exception para un producto invalido', async () => {
    const producto: ProductoEntity = productosList[0];
    await service.delete(producto.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "El producto con el id dado no fue encontrado")
  });
 
});
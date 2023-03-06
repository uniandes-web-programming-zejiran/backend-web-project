/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { NegocioEntity } from './negocio.entity';
import { NegocioService } from './negocio.service';

import { faker } from '@faker-js/faker';

describe('NegocioService', () => {
  let service: NegocioService;
  let repository: Repository<NegocioEntity>;
  let negociosList: NegocioEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [NegocioService],
    }).compile();

    service = module.get<NegocioService>(NegocioService);
    repository = module.get<Repository<NegocioEntity>>(getRepositoryToken(NegocioEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    negociosList = [];
    for(let i = 0; i < 5; i++){
        const negocio: NegocioEntity = await repository.save({
        nombre: faker.company.companyName(), 
        tipo: faker.lorem.sentence(), 
        ubicacion: faker.lorem.sentence(), 
        fechaCreacion: faker.lorem.sentence(), 
        imagen: faker.image.imageUrl()})
        negociosList.push(negocio);
    }
  }
    
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll deberia retornar todos los negocios', async () => {
    const negocios: NegocioEntity[] = await service.findAll();
    expect(negocios).not.toBeNull();
    expect(negocios).toHaveLength(negociosList.length);
  });

  it('findOne deberia retornar el negocio por id', async () => {
    const storedNegocio: NegocioEntity = negociosList[0];
    const negocio: NegocioEntity = await service.findOne(storedNegocio.id);
    expect(negocio).not.toBeNull();
    expect(negocio.nombre).toEqual(storedNegocio.nombre)
    expect(negocio.tipo).toEqual(storedNegocio.tipo)
    expect(negocio.ubicacion).toEqual(storedNegocio.ubicacion)
    expect(negocio.fechaCreacion).toEqual(storedNegocio.fechaCreacion)
    expect(negocio.imagen).toEqual(storedNegocio.imagen)
  });

  it('findOne deberia mandar exception para un negocio invalido', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "El negocio con el id dado no fue encontrado")
  });

  it('create deberia retornar un negocio', async () => {
    const negocio: NegocioEntity = {
      id: "",
      nombre: faker.company.companyName(), 
      tipo: faker.lorem.sentence(), 
      ubicacion: faker.lorem.sentence(), 
      fechaCreacion: faker.lorem.sentence(), 
      imagen: faker.image.imageUrl(),
      productos: [],
      eventos: []
    }

    const newNegocio: NegocioEntity = await service.create(negocio);
    expect(newNegocio).not.toBeNull();

    const storedNegocio: NegocioEntity = await repository.findOne({where: {id: newNegocio.id}})
    expect(storedNegocio).not.toBeNull();
    expect(storedNegocio.nombre).toEqual(newNegocio.nombre)
    expect(storedNegocio.tipo).toEqual(newNegocio.tipo)
    expect(storedNegocio.ubicacion).toEqual(newNegocio.ubicacion)
    expect(storedNegocio.fechaCreacion).toEqual(newNegocio.fechaCreacion)
    expect(storedNegocio.imagen).toEqual(newNegocio.imagen)
  });

  it('update deberia modificar un negocio', async () => {
    const negocio: NegocioEntity = negociosList[0];
    negocio.nombre = "Nuevo nombre";
  
    const updatedNegocio: NegocioEntity = await service.update(negocio.id, negocio);
    expect(updatedNegocio).not.toBeNull();
  
    const storedNegocio: NegocioEntity = await repository.findOne({ where: { id: negocio.id } })
    expect(storedNegocio).not.toBeNull();
    expect(storedNegocio.nombre).toEqual(negocio.nombre)
  });
 
  it('update deberia mandar exception si el negocio no es valido', async () => {
    let negocio: NegocioEntity = negociosList[0];
    negocio = {
      ...negocio, nombre: "Nuevo Nombre"
    }
    await expect(() => service.update("0", negocio)).rejects.toHaveProperty("message", "El negocio con el id dado no fue encontrado")
  });

  it('delete deberia remover un negocio', async () => {
    const negocio: NegocioEntity = negociosList[0];
    await service.delete(negocio.id);
  
    const deletedNegocio: NegocioEntity = await repository.findOne({ where: { id: negocio.id } })
    expect(deletedNegocio).toBeNull();
  });

  it('delete deberia mandar exception para un negocio invalido', async () => {
    const negocio: NegocioEntity = negociosList[0];
    await service.delete(negocio.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "El negocio con el id dado no fue encontrado")
  });
 
});
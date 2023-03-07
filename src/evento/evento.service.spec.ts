/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { EventoEntity } from './evento.entity';
import { EventoService } from './evento.service';

import { faker } from '@faker-js/faker';
import { NegocioEntity } from 'src/negocio/negocio.entity';

describe('EventoService', () => {
  let service: EventoService;
  let repository: Repository<EventoEntity>;
  let eventosList: EventoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [EventoService],
    }).compile();

    service = module.get<EventoService>(EventoService);
    repository = module.get<Repository<EventoEntity>>(
      getRepositoryToken(EventoEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    eventosList = [];
    for (let i = 0; i < 5; i++) {
      const evento: EventoEntity = await repository.save({
        titulo: faker.lorem.sentence(),
        objetivo: faker.lorem.sentence(),
        lugar: faker.address.city(),
        fecha: faker.date.between('2023-03-07', '2023-12-31').toISOString(),
        imagen: faker.image.imageUrl(),
      });
      eventosList.push(evento);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll deberia retornar todos los eventos', async () => {
    const eventos: EventoEntity[] = await service.findAll();
    expect(eventos).not.toBeNull();
    expect(eventos).toHaveLength(eventosList.length);
  });

  it('findOne deberia retornar el evento por id', async () => {
    const storedEvento: EventoEntity = eventosList[0];
    const evento: EventoEntity = await service.findOne(storedEvento.id);
    expect(evento).not.toBeNull();
    expect(evento.titulo).toEqual(storedEvento.titulo);
    expect(evento.objetivo).toEqual(storedEvento.objetivo);
    expect(evento.lugar).toEqual(storedEvento.lugar);
    expect(evento.fecha).toEqual(storedEvento.fecha);
    expect(evento.imagen).toEqual(storedEvento.imagen);
  });

  it('findOne deberia mandar exception para un evento invalido', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The event with the given id was not found',
    );
  });

  it('create deberia retornar un evento', async () => {
    const evento: EventoEntity = {
      id: '',
      titulo: faker.lorem.sentence(),
      objetivo: faker.lorem.sentence(),
      lugar: faker.address.city(),
      fecha: faker.date.between('2023-03-07', '2023-12-31').toISOString(),
      imagen: faker.image.imageUrl(),
      negocio: new NegocioEntity,
    };

    const newEvento: EventoEntity = await service.create(evento);
    expect(newEvento).not.toBeNull();

    const storedEvento: EventoEntity = await repository.findOne({
      where: { id: newEvento.id },
    });
    expect(storedEvento).not.toBeNull();
    expect(storedEvento.titulo).toEqual(newEvento.titulo);
    expect(storedEvento.objetivo).toEqual(newEvento.objetivo);
    expect(storedEvento.lugar).toEqual(newEvento.lugar);
    expect(storedEvento.fecha).toEqual(newEvento.fecha);
    expect(storedEvento.imagen).toEqual(newEvento.imagen);
  });

  it('update deberia modificar un evento', async () => {
    const evento: EventoEntity = eventosList[0];
    evento.titulo = 'Nuevo titulo';

    const updatedEvento: EventoEntity = await service.update(evento.id, evento);
    expect(updatedEvento).not.toBeNull();

    const storedEvento: EventoEntity = await repository.findOne({
      where: { id: evento.id },
    });
    expect(storedEvento).not.toBeNull();
    expect(storedEvento.titulo).toEqual(evento.titulo);
  });

  it('update deberia mandar exception si el evento no es valido', async () => {
    let evento: EventoEntity = eventosList[0];
    evento = {
      ...evento,
      titulo: 'Nuevo titulo',
    };
    await expect(() => service.update('0', evento)).rejects.toHaveProperty(
      'message',
      'The event with the given id was not found',
    );
  });

  it('delete deberia remover un evento', async () => {
    const evento: EventoEntity = eventosList[0];
    await service.delete(evento.id);

    const deletedEvento: EventoEntity = await repository.findOne({
      where: { id: evento.id },
    });
    expect(deletedEvento).toBeNull();
  });

  it('delete deberia mandar exception para un evento invalido', async () => {
    const evento: EventoEntity = eventosList[0];
    await service.delete(evento.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'The event with the given id was not found',
    );
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { EventoEntity } from '../evento/evento.entity';
import { Repository } from 'typeorm';
import { NegocioEntity } from '../negocio/negocio.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { NegocioEventoService } from './negocio-evento.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('NegocioEventoService', () => {
  let service: NegocioEventoService;
  let negocioRepository: Repository<NegocioEntity>;
  let eventoRepository: Repository<EventoEntity>;
  let negocio: NegocioEntity;
  let eventosList: EventoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [NegocioEventoService],
    }).compile();

    service = module.get<NegocioEventoService>(NegocioEventoService);
    negocioRepository = module.get<Repository<NegocioEntity>>(
      getRepositoryToken(NegocioEntity),
    );
    eventoRepository = module.get<Repository<EventoEntity>>(
      getRepositoryToken(EventoEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    eventoRepository.clear();
    negocioRepository.clear();

    eventosList = [];
    for (let i = 0; i < 5; i++) {
      const evento: EventoEntity = await eventoRepository.save({
        titulo: faker.company.name(),
        objetivo: faker.lorem.sentence(),
        lugar: faker.lorem.sentence(),
        fecha: faker.lorem.sentence(),
        imagen: faker.image.imageUrl(),
      });
      eventosList.push(evento);
    }

    negocio = await negocioRepository.save({
      nombre: faker.company.name(),
      tipo: faker.lorem.sentence(),
      ubicacion: faker.lorem.sentence(),
      fechaCreacion: faker.lorem.sentence(),
      imagen: faker.image.imageUrl(),
      eventos: eventosList,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addEventoNegocio should add an evento to a negocio', async () => {
    const newEvento: EventoEntity = await eventoRepository.save({
      titulo: faker.company.name(),
      objetivo: faker.lorem.sentence(),
      lugar: faker.lorem.sentence(),
      fecha: faker.lorem.sentence(),
      imagen: faker.image.imageUrl(),
    });

    const newNegocio: NegocioEntity = await negocioRepository.save({
      nombre: faker.company.name(),
      tipo: faker.lorem.sentence(),
      ubicacion: faker.lorem.sentence(),
      fechaCreacion: faker.lorem.sentence(),
      imagen: faker.image.imageUrl(),
    });

    const result: NegocioEntity = await service.addEventoNegocio(
      newNegocio.id,
      newEvento.id,
    );

    expect(result.eventos.length).toBe(1);
    expect(result.eventos[0]).not.toBeNull();
    expect(result.eventos[0].titulo).toBe(newEvento.titulo);
    expect(result.eventos[0].objetivo).toBe(newEvento.objetivo);
    expect(result.eventos[0].lugar).toBe(newEvento.lugar);
    expect(result.eventos[0].fecha).toBe(newEvento.fecha);
    expect(result.eventos[0].imagen).toBe(newEvento.imagen);
  });

  it('addEventoNegocio should thrown exception for an invalid evento', async () => {
    const newNegocio: NegocioEntity = await negocioRepository.save({
      nombre: faker.company.name(),
      tipo: faker.lorem.sentence(),
      ubicacion: faker.lorem.sentence(),
      fechaCreacion: faker.lorem.sentence(),
      imagen: faker.image.imageUrl(),
    });

    await expect(() =>
      service.addEventoNegocio(newNegocio.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'El evento con el id dado no fue encontrado',
    );
  });

  it('addEventoNegocio should throw an exception for an invalid negocio', async () => {
    const newEvento: EventoEntity = await eventoRepository.save({
      titulo: faker.company.name(),
      objetivo: faker.lorem.sentence(),
      lugar: faker.lorem.sentence(),
      fecha: faker.lorem.sentence(),
      imagen: faker.image.imageUrl(),
    });

    await expect(() =>
      service.addEventoNegocio('0', newEvento.id),
    ).rejects.toHaveProperty(
      'message',
      'El negocio con el id dado no fue encontrado',
    );
  });

  it('findEventoByNegocioIdEventoId should return evento by negocio', async () => {
    const evento: EventoEntity = eventosList[0];
    const storedEvento: EventoEntity =
      await service.findEventoByNegocioIdEventoId(negocio.id, evento.id);
    expect(storedEvento).not.toBeNull();
    expect(storedEvento.titulo).toBe(evento.titulo);
    expect(storedEvento.objetivo).toBe(evento.objetivo);
    expect(storedEvento.lugar).toBe(evento.lugar);
    expect(storedEvento.fecha).toBe(evento.fecha);
    expect(storedEvento.imagen).toBe(evento.imagen);
  });

  it('findEventoByNegocioIdEventoId should throw an exception for an invalid evento', async () => {
    await expect(() =>
      service.findEventoByNegocioIdEventoId(negocio.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'El evento con el id dado no fue encontrado',
    );
  });

  it('findEventoByNegocioIdEventoId should throw an exception for an invalid negocio', async () => {
    const evento: EventoEntity = eventosList[0];
    await expect(() =>
      service.findEventoByNegocioIdEventoId('0', evento.id),
    ).rejects.toHaveProperty(
      'message',
      'El negocio con el id dado no fue encontrado',
    );
  });

  it('findEventoByNegocioIdEventoId should throw an exception for an evento not associated to the negocio', async () => {
    const newEvento: EventoEntity = await eventoRepository.save({
      titulo: faker.company.name(),
      objetivo: faker.lorem.sentence(),
      lugar: faker.lorem.sentence(),
      fecha: faker.lorem.sentence(),
      imagen: faker.image.imageUrl(),
    });

    await expect(() =>
      service.findEventoByNegocioIdEventoId(negocio.id, newEvento.id),
    ).rejects.toHaveProperty(
      'message',
      'El evento con el id dado no esta asociado al negocio',
    );
  });

  it('findEventosByNegocioId should return eventos by negocio', async () => {
    const eventos: EventoEntity[] = await service.findEventosByNegocioId(
      negocio.id,
    );
    expect(eventos.length).toBe(5);
  });

  it('findEventosByNegocioId should throw an exception for an invalid negocio', async () => {
    await expect(() =>
      service.findEventosByNegocioId('0'),
    ).rejects.toHaveProperty(
      'message',
      'El negocio con el id dado no fue encontrado',
    );
  });

  it('associateEventosNegocio should update eventos list for a negocio', async () => {
    const newEvento: EventoEntity = await eventoRepository.save({
      titulo: faker.company.name(),
      objetivo: faker.lorem.sentence(),
      lugar: faker.lorem.sentence(),
      fecha: faker.lorem.sentence(),
      imagen: faker.image.imageUrl(),
    });

    const updatedNegocio: NegocioEntity = await service.associateEventosNegocio(
      negocio.id,
      [newEvento],
    );
    expect(updatedNegocio.eventos.length).toBe(1);

    expect(updatedNegocio.eventos[0].titulo).toBe(newEvento.titulo);
    expect(updatedNegocio.eventos[0].objetivo).toBe(newEvento.objetivo);
    expect(updatedNegocio.eventos[0].lugar).toBe(newEvento.lugar);
    expect(updatedNegocio.eventos[0].fecha).toBe(newEvento.fecha);
    expect(updatedNegocio.eventos[0].imagen).toBe(newEvento.imagen);
  });

  it('associateEventosNegocio should throw an exception for an invalid negocio', async () => {
    const newEvento: EventoEntity = await eventoRepository.save({
      titulo: faker.company.name(),
      objetivo: faker.lorem.sentence(),
      lugar: faker.lorem.sentence(),
      fecha: faker.lorem.sentence(),
      imagen: faker.image.imageUrl(),
    });

    await expect(() =>
      service.associateEventosNegocio('0', [newEvento]),
    ).rejects.toHaveProperty(
      'message',
      'El negocio con el id dado no fue encontrado',
    );
  });

  it('associateEventosNegocio should throw an exception for an invalid evento', async () => {
    const newEvento: EventoEntity = eventosList[0];
    newEvento.id = '0';

    await expect(() =>
      service.associateEventosNegocio(negocio.id, [newEvento]),
    ).rejects.toHaveProperty(
      'message',
      'El evento con el id dado no fue encontrado',
    );
  });

  it('deleteEventoToNegocio should remove an evento from a negocio', async () => {
    const evento: EventoEntity = eventosList[0];

    await service.deleteEventoNegocio(negocio.id, evento.id);

    const storedNegocio: NegocioEntity = await negocioRepository.findOne({
      where: { id: negocio.id },
      relations: ['eventos'],
    });
    const deletedEvento: EventoEntity = storedNegocio.eventos.find(
      (a) => a.id === evento.id,
    );

    expect(deletedEvento).toBeUndefined();
  });

  it('deleteEventoToNegocio should thrown an exception for an invalid evento', async () => {
    await expect(() =>
      service.deleteEventoNegocio(negocio.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'El evento con el id dado no fue encontrado',
    );
  });

  it('deleteEventoToNegocio should thrown an exception for an invalid negocio', async () => {
    const evento: EventoEntity = eventosList[0];
    await expect(() =>
      service.deleteEventoNegocio('0', evento.id),
    ).rejects.toHaveProperty(
      'message',
      'El negocio con el id dado no fue encontrado',
    );
  });

  it('deleteEventoToNegocio should thrown an exception for an non asocciated evento', async () => {
    const newEvento: EventoEntity = await eventoRepository.save({
      titulo: faker.company.name(),
      objetivo: faker.lorem.sentence(),
      lugar: faker.lorem.sentence(),
      fecha: faker.lorem.sentence(),
      imagen: faker.image.imageUrl(),
    });

    await expect(() =>
      service.deleteEventoNegocio(negocio.id, newEvento.id),
    ).rejects.toHaveProperty(
      'message',
      'El evento con el id dado no esta asociado al negocio',
    );
  });
});

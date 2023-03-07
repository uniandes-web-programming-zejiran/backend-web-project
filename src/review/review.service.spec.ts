/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { ReviewEntity } from './review.entity';
import { ReviewService } from './review.service';

import { faker } from '@faker-js/faker';
import { UsuarioEntity } from 'src/usuario/usuario.entity';
import { ProductoEntity } from 'src/producto/producto.entity';

describe('ReviewService', () => {
  let service: ReviewService;
  let repository: Repository<ReviewEntity>;
  let reviewsList: ReviewEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ReviewService],
    }).compile();

    service = module.get<ReviewService>(ReviewService);
    repository = module.get<Repository<ReviewEntity>>(
      getRepositoryToken(ReviewEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    reviewsList = [];
    for (let i = 0; i < 5; i++) {
      const review: ReviewEntity = await repository.save({
        titulo: faker.lorem.sentence(),
        descripcion: faker.lorem.paragraph(),
        puntaje: faker.random.numeric().toString(),
        imagen: faker.image.imageUrl(),
        fecha: faker.date.past().toISOString(),
      });
      reviewsList.push(review);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll deberia retornar todos los reviews', async () => {
    const reviews: ReviewEntity[] = await service.findAll();
    expect(reviews).not.toBeNull();
    expect(reviews).toHaveLength(reviewsList.length);
  });

  it('findOne deberia retornar el review por id', async () => {
    const storedReview: ReviewEntity = reviewsList[0];
    const review: ReviewEntity = await service.findOne(storedReview.id);
    expect(review).not.toBeNull();
    expect(review.titulo).toEqual(storedReview.titulo);
    expect(review.descripcion).toEqual(storedReview.descripcion);
    expect(review.puntaje).toEqual(storedReview.puntaje);
    expect(review.imagen).toEqual(storedReview.imagen);
    expect(review.fecha).toEqual(storedReview.fecha);
  });

  it('findOne deberia mandar exception para un review invalido', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'El review con el id dado no fue encontrado',
    );
  });

  it('create deberia retornar un review', async () => {
    const review: ReviewEntity = {
      id: '',
      titulo: faker.lorem.sentence(),
      descripcion: faker.lorem.paragraph(),
      puntaje: faker.random.numeric().toString(),
      imagen: faker.image.imageUrl(),
      fecha: faker.date.past().toISOString(),
      usuario: new UsuarioEntity(),
      producto: new ProductoEntity(),
    };

    const newReview: ReviewEntity = await service.create(review);
    expect(newReview).not.toBeNull();

    const storedReview: ReviewEntity = await repository.findOne({
      where: { id: newReview.id },
    });
    expect(storedReview).not.toBeNull();
    expect(storedReview.titulo).toEqual(newReview.titulo);
    expect(storedReview.descripcion).toEqual(newReview.descripcion);
    expect(storedReview.puntaje).toEqual(newReview.puntaje);
    expect(storedReview.imagen).toEqual(newReview.imagen);
    expect(storedReview.fecha).toEqual(newReview.fecha);
  });

  it('update deberia modificar un review', async () => {
    const review: ReviewEntity = reviewsList[0];
    review.titulo = 'Nuevo título';

    const updatedReview: ReviewEntity = await service.update(review.id, review);
    expect(updatedReview).not.toBeNull();

    const storedReview: ReviewEntity = await repository.findOne({
      where: { id: review.id },
    });
    expect(storedReview).not.toBeNull();
    expect(storedReview.titulo).toEqual(review.titulo);
  });

  it('update deberia mandar exception si el review no es valido', async () => {
    let review: ReviewEntity = reviewsList[0];
    review = {
      ...review,
      titulo: 'Nuevo título',
    };
    await expect(() => service.update('0', review)).rejects.toHaveProperty(
      'message',
      'The review with the given id was not found',
    );
  });

  it('delete deberia remover un review', async () => {
    const review: ReviewEntity = reviewsList[0];
    await service.delete(review.id);

    const deletedReview: ReviewEntity = await repository.findOne({
      where: { id: review.id },
    });
    expect(deletedReview).toBeNull();
  });

  it('delete deberia mandar exception para un review invalido', async () => {
    const review: ReviewEntity = reviewsList[0];
    await service.delete(review.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'The review with the given id was not found',
    );
  });
});

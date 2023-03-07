import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { ReviewEntity } from '../review/review.entity';
import { UsuarioEntity } from '../usuario/usuario.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { ReviewUsuarioService } from './review-usuario.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('ReviewUsuarioService', () => {
  let service: ReviewUsuarioService;
  let reviewRepository: Repository<ReviewEntity>;
  let usuarioRepository: Repository<UsuarioEntity>;
  let usuario: UsuarioEntity;
  let reviewsList: ReviewEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ReviewUsuarioService],
    }).compile();

    service = module.get<ReviewUsuarioService>(ReviewUsuarioService);
    reviewRepository = module.get<Repository<ReviewEntity>>(
      getRepositoryToken(ReviewEntity),
    );
    usuarioRepository = module.get<Repository<UsuarioEntity>>(
      getRepositoryToken(UsuarioEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    usuarioRepository.clear();
    reviewRepository.clear();

    reviewsList = [];
    for (let i = 0; i < 5; i++) {
      const review: ReviewEntity = await reviewRepository.save({
        titulo: faker.lorem.sentence(),
        descripcion: faker.lorem.paragraph(),
        puntaje: faker.random.numeric().toString(),
        imagen: faker.image.imageUrl(),
        fecha: faker.date.past().toISOString(),
      });
      reviewsList.push(review);
    }

    usuario = await usuarioRepository.save({
      cedula: faker.random.numeric(10).toString(),
      nombre: faker.name.firstName(),
      fechaInscripcion: faker.date.past().toString(),
      fechaNacimiento: faker.date.birthdate().toString(),
      imagen: faker.image.avatar(),
      reviews: reviewsList,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addUsuarioReview should add review to product', async () => {
    const newUsuario: UsuarioEntity = await usuarioRepository.save({
      cedula: faker.random.numeric(10).toString(),
      nombre: faker.name.firstName(),
      fechaInscripcion: faker.date.past().toString(),
      fechaNacimiento: faker.date.birthdate().toString(),
      imagen: faker.image.avatar(),
    });

    const newReview: ReviewEntity = await reviewRepository.save({
      titulo: faker.lorem.sentence(),
      descripcion: faker.lorem.paragraph(),
      puntaje: faker.random.numeric().toString(),
      imagen: faker.image.imageUrl(),
      fecha: faker.date.past().toISOString(),
    });

    const result: UsuarioEntity = await service.addReviewUsuario(
      newReview.id,
      newUsuario.cedula,
    );

    expect(result.reviews).not.toBeNull();
    expect(result.reviews[0].titulo).toBe(newReview.titulo);
    expect(result.reviews[0].descripcion).toBe(newReview.descripcion);
    expect(result.reviews[0].puntaje).toBe(newReview.puntaje);
    expect(result.reviews[0].imagen).toBe(newReview.imagen);
    expect(result.reviews[0].fecha).toBe(newReview.fecha);
  });

  it('addUsuarioReview should thrown exception for an invalid product', async () => {
    const newReview: ReviewEntity = await reviewRepository.save({
      titulo: faker.lorem.sentence(),
      descripcion: faker.lorem.paragraph(),
      puntaje: faker.random.numeric().toString(),
      imagen: faker.image.imageUrl(),
      fecha: faker.date.past().toISOString(),
    });

    await expect(() =>
      service.addReviewUsuario(newReview.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'El usuario con el id dado no fue encontrado',
    );
  });

  it('addUsuarioReview should throw an exception for an invalid review', async () => {
    const newUsuario: UsuarioEntity = await usuarioRepository.save({
      cedula: faker.random.numeric(10).toString(),
      nombre: faker.name.firstName(),
      fechaInscripcion: faker.date.past().toString(),
      fechaNacimiento: faker.date.birthdate().toString(),
      imagen: faker.image.avatar(),
    });

    await expect(() =>
      service.addReviewUsuario('0', newUsuario.cedula),
    ).rejects.toHaveProperty(
      'message',
      'The review with the given id was not found',
    );
  });

  it('findReviewByUsuarioIdReviewId should return review by product', async () => {
    const review: ReviewEntity = reviewsList[0];
    const storedReview: ReviewEntity =
      await service.findReviewByUsuarioIdReviewId(review.id, usuario.cedula);
    expect(storedReview).not.toBeNull();
    expect(storedReview.titulo).toBe(review.titulo);
    expect(storedReview.descripcion).toBe(review.descripcion);
    expect(storedReview.puntaje).toBe(review.puntaje);
    expect(storedReview.imagen).toBe(review.imagen);
    expect(storedReview.fecha).toBe(review.fecha);
  });

  it('findReviewByUsuarioIdReviewId should throw an exception for an invalid product', async () => {
    const review: ReviewEntity = reviewsList[0];
    await expect(() =>
      service.findReviewByUsuarioIdReviewId(review.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'El usuario con el id dado no fue encontrado',
    );
  });

  it('findReviewByUsuarioIdReviewId should throw an exception for an invalid review', async () => {
    await expect(() =>
      service.findReviewByUsuarioIdReviewId('0', usuario.cedula),
    ).rejects.toHaveProperty(
      'message',
      'The review with the given id was not found',
    );
  });

  it('findReviewByUsuarioIdReviewId should throw an exception for a review not associated to the product', async () => {
    const newReview: ReviewEntity = await reviewRepository.save({
      titulo: faker.lorem.sentence(),
      descripcion: faker.lorem.paragraph(),
      puntaje: faker.random.numeric().toString(),
      imagen: faker.image.imageUrl(),
      fecha: faker.date.past().toISOString(),
    });

    await expect(() =>
      service.findReviewByUsuarioIdReviewId(newReview.id, usuario.cedula),
    ).rejects.toHaveProperty(
      'message',
      'El review con el id dado no está asociado al usuario',
    );
  });

  it('findReviewsByProductId should return usuarios by product', async () => {
    const reviews: ReviewEntity[] = await service.findReviewsByProductId(
      usuario.cedula,
    );
    expect(reviews.length).toBe(5);
  });

  it('findReviewsByProductId should throw an exception for an invalid product', async () => {
    await expect(() =>
      service.findReviewsByProductId('0'),
    ).rejects.toHaveProperty(
      'message',
      'El usuario con el id dado no fue encontrado',
    );
  });

  it('associateReviewsUsuario should update reviews list for a product', async () => {
    const newReview: ReviewEntity = await reviewRepository.save({
      titulo: faker.lorem.sentence(),
      descripcion: faker.lorem.paragraph(),
      puntaje: faker.random.numeric().toString(),
      imagen: faker.image.imageUrl(),
      fecha: faker.date.past().toISOString(),
    });

    const updatedProduct: UsuarioEntity = await service.associateReviewsUsuario(
      usuario.cedula,
      [newReview],
    );
    expect(updatedProduct.reviews.length).toBe(1);

    expect(updatedProduct.reviews[0].titulo).toBe(newReview.titulo);
    expect(updatedProduct.reviews[0].descripcion).toBe(newReview.descripcion);
    expect(updatedProduct.reviews[0].puntaje).toBe(newReview.puntaje);
    expect(updatedProduct.reviews[0].imagen).toBe(newReview.imagen);
    expect(updatedProduct.reviews[0].fecha).toBe(newReview.fecha);
  });

  it('associateReviewsUsuario should throw an exception for an invalid product', async () => {
    const newReview: ReviewEntity = await reviewRepository.save({
      titulo: faker.lorem.sentence(),
      descripcion: faker.lorem.paragraph(),
      puntaje: faker.random.numeric().toString(),
      imagen: faker.image.imageUrl(),
      fecha: faker.date.past().toISOString(),
    });

    await expect(() =>
      service.associateReviewsUsuario('0', [newReview]),
    ).rejects.toHaveProperty(
      'message',
      'El usuario con el id dado no fue encontrado',
    );
  });

  it('associateReviewsUsuario should throw an exception for an invalid review', async () => {
    const newReview: ReviewEntity = reviewsList[0];
    newReview.id = '0';

    await expect(() =>
      service.associateReviewsUsuario(usuario.cedula, [newReview]),
    ).rejects.toHaveProperty(
      'message',
      'The review with the given id was not found',
    );
  });

  it('deleteUsuarioToReview should remove a review from a product', async () => {
    const review: ReviewEntity = reviewsList[0];

    await service.deleteReviewUsuario(review.id, usuario.cedula);

    const storedUsuario: UsuarioEntity = await usuarioRepository.findOne({
      where: { cedula: usuario.cedula },
      relations: ['reviews'],
    });
    const deletedReview: ReviewEntity = storedUsuario.reviews.find(
      (a) => a.id === review.id,
    );

    expect(deletedReview).toBeUndefined();
  });

  it('deleteUsuarioToReview should thrown an exception for an invalid review', async () => {
    await expect(() =>
      service.deleteReviewUsuario('0', usuario.cedula),
    ).rejects.toHaveProperty(
      'message',
      'The review with the given id was not found',
    );
  });

  it('deleteUsuarioToReview should thrown an exception for an invalid product', async () => {
    const review: ReviewEntity = reviewsList[0];
    await expect(() =>
      service.deleteReviewUsuario(review.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'El usuario con el id dado no fue encontrado',
    );
  });

  it('deleteUsuarioToReview should thrown an exception for an non asocciated review', async () => {
    const newReview: ReviewEntity = await reviewRepository.save({
      titulo: faker.lorem.sentence(),
      descripcion: faker.lorem.paragraph(),
      puntaje: faker.random.numeric().toString(),
      imagen: faker.image.imageUrl(),
      fecha: faker.date.past().toISOString(),
    });

    await expect(() =>
      service.deleteReviewUsuario(newReview.id, usuario.cedula),
    ).rejects.toHaveProperty(
      'message',
      'El review con el id dado no está asociado al usuario',
    );
  });
});

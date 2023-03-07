import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { ReviewEntity } from '../review/review.entity';
import { ProductoEntity } from '../producto/producto.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { ReviewProductoService } from './review-producto.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('ReviewProductoService', () => {
  let service: ReviewProductoService;
  let reviewRepository: Repository<ReviewEntity>;
  let productoRepository: Repository<ProductoEntity>;
  let producto: ProductoEntity;
  let reviewsList: ReviewEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ReviewProductoService],
    }).compile();

    service = module.get<ReviewProductoService>(ReviewProductoService);
    reviewRepository = module.get<Repository<ReviewEntity>>(
      getRepositoryToken(ReviewEntity),
    );
    productoRepository = module.get<Repository<ProductoEntity>>(
      getRepositoryToken(ProductoEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    productoRepository.clear();
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

    producto = await productoRepository.save({
      nombre: faker.company.name(),
      precio: faker.datatype.number(),
      stock: faker.datatype.number(),
      categoria: faker.lorem.sentence(),
      imagen: faker.image.imageUrl(),
      reviews: reviewsList,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addProductoReview should add review to product', async () => {
    const newProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.company.name(),
      precio: faker.datatype.number(),
      stock: faker.datatype.number(),
      categoria: faker.lorem.sentence(),
      imagen: faker.image.imageUrl(),
    });

    const newReview: ReviewEntity = await reviewRepository.save({
      titulo: faker.lorem.sentence(),
      descripcion: faker.lorem.paragraph(),
      puntaje: faker.random.numeric().toString(),
      imagen: faker.image.imageUrl(),
      fecha: faker.date.past().toISOString(),
    });

    const result: ProductoEntity = await service.addReviewProducto(
      newReview.id,
      newProducto.id,
    );

    expect(result.reviews).not.toBeNull();
    expect(result.reviews[0].titulo).toBe(newReview.titulo);
    expect(result.reviews[0].descripcion).toBe(newReview.descripcion);
    expect(result.reviews[0].puntaje).toBe(newReview.puntaje);
    expect(result.reviews[0].imagen).toBe(newReview.imagen);
    expect(result.reviews[0].fecha).toBe(newReview.fecha);
  });

  it('addProductoReview should thrown exception for an invalid product', async () => {
    const newReview: ReviewEntity = await reviewRepository.save({
      titulo: faker.lorem.sentence(),
      descripcion: faker.lorem.paragraph(),
      puntaje: faker.random.numeric().toString(),
      imagen: faker.image.imageUrl(),
      fecha: faker.date.past().toISOString(),
    });

    await expect(() =>
      service.addReviewProducto(newReview.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'El producto con el id dado no fue encontrado',
    );
  });

  it('addProductoReview should throw an exception for an invalid review', async () => {
    const newProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.company.name(),
      precio: faker.datatype.number(),
      stock: faker.datatype.number(),
      categoria: faker.lorem.sentence(),
      imagen: faker.image.imageUrl(),
    });

    await expect(() =>
      service.addReviewProducto('0', newProducto.id),
    ).rejects.toHaveProperty(
      'message',
      'The review with the given id was not found',
    );
  });

  it('findReviewByProductoIdReviewId should return review by product', async () => {
    const review: ReviewEntity = reviewsList[0];
    const storedReview: ReviewEntity =
      await service.findReviewByProductoIdReviewId(review.id, producto.id);
    expect(storedReview).not.toBeNull();
    expect(storedReview.titulo).toBe(review.titulo);
    expect(storedReview.descripcion).toBe(review.descripcion);
    expect(storedReview.puntaje).toBe(review.puntaje);
    expect(storedReview.imagen).toBe(review.imagen);
    expect(storedReview.fecha).toBe(review.fecha);
  });

  it('findReviewByProductoIdReviewId should throw an exception for an invalid product', async () => {
    const review: ReviewEntity = reviewsList[0];
    await expect(() =>
      service.findReviewByProductoIdReviewId(review.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'El producto con el id dado no fue encontrado',
    );
  });

  it('findReviewByProductoIdReviewId should throw an exception for an invalid review', async () => {
    await expect(() =>
      service.findReviewByProductoIdReviewId('0', producto.id),
    ).rejects.toHaveProperty(
      'message',
      'The review with the given id was not found',
    );
  });

  it('findReviewByProductoIdReviewId should throw an exception for a review not associated to the product', async () => {
    const newReview: ReviewEntity = await reviewRepository.save({
      titulo: faker.lorem.sentence(),
      descripcion: faker.lorem.paragraph(),
      puntaje: faker.random.numeric().toString(),
      imagen: faker.image.imageUrl(),
      fecha: faker.date.past().toISOString(),
    });

    await expect(() =>
      service.findReviewByProductoIdReviewId(newReview.id, producto.id),
    ).rejects.toHaveProperty(
      'message',
      'El review con el id dado no está asociado al producto',
    );
  });

  it('findReviewsByProductId should return productos by product', async () => {
    const reviews: ReviewEntity[] = await service.findReviewsByProductId(
      producto.id,
    );
    expect(reviews.length).toBe(5);
  });

  it('findReviewsByProductId should throw an exception for an invalid product', async () => {
    await expect(() =>
      service.findReviewsByProductId('0'),
    ).rejects.toHaveProperty(
      'message',
      'El producto con el id dado no fue encontrado',
    );
  });

  it('associateReviewsProducto should update reviews list for a product', async () => {
    const newReview: ReviewEntity = await reviewRepository.save({
      titulo: faker.lorem.sentence(),
      descripcion: faker.lorem.paragraph(),
      puntaje: faker.random.numeric().toString(),
      imagen: faker.image.imageUrl(),
      fecha: faker.date.past().toISOString(),
    });

    const updatedProduct: ProductoEntity =
      await service.associateReviewsProducto(producto.id, [newReview]);
    expect(updatedProduct.reviews.length).toBe(1);

    expect(updatedProduct.reviews[0].titulo).toBe(newReview.titulo);
    expect(updatedProduct.reviews[0].descripcion).toBe(newReview.descripcion);
    expect(updatedProduct.reviews[0].puntaje).toBe(newReview.puntaje);
    expect(updatedProduct.reviews[0].imagen).toBe(newReview.imagen);
    expect(updatedProduct.reviews[0].fecha).toBe(newReview.fecha);
  });

  it('associateReviewsProducto should throw an exception for an invalid product', async () => {
    const newReview: ReviewEntity = await reviewRepository.save({
      titulo: faker.lorem.sentence(),
      descripcion: faker.lorem.paragraph(),
      puntaje: faker.random.numeric().toString(),
      imagen: faker.image.imageUrl(),
      fecha: faker.date.past().toISOString(),
    });

    await expect(() =>
      service.associateReviewsProducto('0', [newReview]),
    ).rejects.toHaveProperty(
      'message',
      'El producto con el id dado no fue encontrado',
    );
  });

  it('associateReviewsProducto should throw an exception for an invalid review', async () => {
    const newReview: ReviewEntity = reviewsList[0];
    newReview.id = '0';

    await expect(() =>
      service.associateReviewsProducto(producto.id, [newReview]),
    ).rejects.toHaveProperty(
      'message',
      'The review with the given id was not found',
    );
  });

  it('deleteProductoToReview should remove a review from a product', async () => {
    const review: ReviewEntity = reviewsList[0];

    await service.deleteReviewProducto(review.id, producto.id);

    const storedProducto: ProductoEntity = await productoRepository.findOne({
      where: { id: producto.id },
      relations: ['reviews'],
    });
    const deletedReview: ReviewEntity = storedProducto.reviews.find(
      (a) => a.id === review.id,
    );

    expect(deletedReview).toBeUndefined();
  });

  it('deleteProductoToReview should thrown an exception for an invalid review', async () => {
    await expect(() =>
      service.deleteReviewProducto('0', producto.id),
    ).rejects.toHaveProperty(
      'message',
      'The review with the given id was not found',
    );
  });

  it('deleteProductoToReview should thrown an exception for an invalid product', async () => {
    const review: ReviewEntity = reviewsList[0];
    await expect(() =>
      service.deleteReviewProducto(review.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'El producto con el id dado no fue encontrado',
    );
  });

  it('deleteProductoToReview should thrown an exception for an non asocciated review', async () => {
    const newReview: ReviewEntity = await reviewRepository.save({
      titulo: faker.lorem.sentence(),
      descripcion: faker.lorem.paragraph(),
      puntaje: faker.random.numeric().toString(),
      imagen: faker.image.imageUrl(),
      fecha: faker.date.past().toISOString(),
    });

    await expect(() =>
      service.deleteReviewProducto(newReview.id, producto.id),
    ).rejects.toHaveProperty(
      'message',
      'El review con el id dado no está asociado al producto',
    );
  });
});

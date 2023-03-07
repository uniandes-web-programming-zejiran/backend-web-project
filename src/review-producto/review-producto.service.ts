import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReviewEntity } from '../review/review.entity';
import { ProductoEntity } from '../producto/producto.entity';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class ReviewProductoService {
  constructor(
    @InjectRepository(ReviewEntity)
    private readonly reviewRepository: Repository<ReviewEntity>,

    @InjectRepository(ProductoEntity)
    private readonly productoRepository: Repository<ProductoEntity>,
  ) {}
  async addReviewProducto(
    reviewId: string,
    productoId: string,
  ): Promise<ProductoEntity> {
    const producto: ProductoEntity = await this.productoRepository.findOne({
      where: { id: productoId },
      relations: ['reviews'],
    });
    if (!producto)
      throw new BusinessLogicException(
        'El producto con el id dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );

    const review: ReviewEntity = await this.reviewRepository.findOne({
      where: { id: reviewId },
    });
    if (!review)
      throw new BusinessLogicException(
        'The review with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    producto.reviews = [...producto.reviews, review];
    return await this.productoRepository.save(producto);
  }

  async findReviewByProductoIdReviewId(
    reviewId: string,
    productoId: string,
  ): Promise<ReviewEntity> {
    const producto: ProductoEntity = await this.productoRepository.findOne({
      where: { id: productoId },
      relations: ['reviews'],
    });
    if (!producto)
      throw new BusinessLogicException(
        'El producto con el id dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );

    const review: ReviewEntity = await this.reviewRepository.findOne({
      where: { id: reviewId },
    });
    if (!review)
      throw new BusinessLogicException(
        'The review with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const reviewProducto: ReviewEntity = producto.reviews.find(
      (e) => e.id === review.id,
    );

    if (!reviewProducto)
      throw new BusinessLogicException(
        'El review con el id dado no está asociado al producto',
        BusinessError.PRECONDITION_FAILED,
      );

    return reviewProducto;
  }

  async findReviewsByProductId(productoId: string): Promise<ReviewEntity[]> {
    const producto: ProductoEntity = await this.productoRepository.findOne({
      where: { id: productoId },
      relations: ['reviews'],
    });
    if (!producto)
      throw new BusinessLogicException(
        'El producto con el id dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );

    return producto.reviews;
  }

  async associateReviewsProducto(
    productoId: string,
    reviews: ReviewEntity[],
  ): Promise<ProductoEntity> {
    const producto: ProductoEntity = await this.productoRepository.findOne({
      where: { id: productoId },
      relations: ['reviews'],
    });

    if (!producto)
      throw new BusinessLogicException(
        'El producto con el id dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );

    for (let i = 0; i < reviews.length; i++) {
      const review: ReviewEntity = await this.reviewRepository.findOne({
        where: { id: reviews[i].id },
      });
      if (!review)
        throw new BusinessLogicException(
          'The review with the given id was not found',
          BusinessError.NOT_FOUND,
        );
    }

    producto.reviews = reviews;
    return await this.productoRepository.save(producto);
  }

  async deleteReviewProducto(reviewId: string, productoId: string) {
    const review: ReviewEntity = await this.reviewRepository.findOne({
      where: { id: reviewId },
    });
    if (!review)
      throw new BusinessLogicException(
        'The review with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const producto: ProductoEntity = await this.productoRepository.findOne({
      where: { id: productoId },
      relations: ['reviews'],
    });
    if (!producto)
      throw new BusinessLogicException(
        'El producto con el id dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );

    const reviewProducto: ReviewEntity = producto.reviews.find(
      (e) => e.id === review.id,
    );

    if (!reviewProducto)
      throw new BusinessLogicException(
        'El review con el id dado no está asociado al producto',
        BusinessError.PRECONDITION_FAILED,
      );

    producto.reviews = producto.reviews.filter((e) => e.id !== reviewId);
    await this.productoRepository.save(producto);
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { ReviewEntity } from './review.entity';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(ReviewEntity)
    private readonly reviewRepository: Repository<ReviewEntity>,
  ) {}

  async findAll(): Promise<ReviewEntity[]> {
    return await this.reviewRepository.find({
      relations: ['usuarios', 'productos'],
    });
  }

  async findOne(id: string): Promise<ReviewEntity> {
    const review = await this.reviewRepository.findOne({
      where: { id },
      relations: ['usuarios', 'productos'],
    });
    if (!review)
      throw new BusinessLogicException(
        'The review with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    return review;
  }

  async create(review: ReviewEntity): Promise<ReviewEntity> {
    return await this.reviewRepository.save(review);
  }

  async update(id: string, review: ReviewEntity): Promise<ReviewEntity> {
    const persistedReview = await this.reviewRepository.findOne({
      where: { id },
    });
    if (!persistedReview)
      throw new BusinessLogicException(
        'The review with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    review.id = id;

    return await this.reviewRepository.save({
      ...persistedReview,
      ...review,
    });
  }

  async delete(id: string): Promise<void> {
    const review: ReviewEntity = await this.reviewRepository.findOne({
      where: { id },
    });
    if (!review)
      throw new BusinessLogicException(
        'The review with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    await this.reviewRepository.remove(review);
  }
}

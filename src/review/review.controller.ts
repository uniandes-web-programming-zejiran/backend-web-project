/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { ReviewDto } from './review.dto';
import { ReviewEntity } from './review.entity';
import { ReviewService } from './review.service';

@Controller('reviews')
@UseInterceptors(BusinessErrorsInterceptor)
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) {}

  @Get()
  async findAll() {
    return await this.reviewService.findAll();
  }

  @Get(':reviewId')
  async findOne(@Param('reviewId') reviewId: string) {
    return await this.reviewService.findOne(reviewId);
  }

  @Post()
  async create(@Body() reviewDto: ReviewDto) {
    const review: ReviewEntity = plainToInstance(ReviewEntity, reviewDto);
    return await this.reviewService.create(review);
  }

  @Put(':reviewId')
  async update(@Param('reviewId') reviewId: string, @Body() reviewDto: ReviewDto) {
    const review: ReviewEntity = plainToInstance(ReviewEntity, reviewDto);
    return await this.reviewService.update(reviewId, review);
  }

  @Delete(':reviewId')
  @HttpCode(204)
  async delete(@Param('reviewId') reviewId: string) {
    return await this.reviewService.delete(reviewId);
  }
}
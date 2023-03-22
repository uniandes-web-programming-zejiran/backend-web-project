/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ReviewDto } from 'src/review/review.dto';
import { ReviewEntity } from 'src/review/review.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { ReviewProductoService } from './review-producto.service';

@Controller('productos')
@UseInterceptors(BusinessErrorsInterceptor)
export class ReviewProductoController {
  constructor(private readonly reviewProductoService: ReviewProductoService) {}

  @Post(':productoId/reviews/:reviewId')
  async addReviewProducto(
    @Param('productoId') productoId: string,
    @Param('reviewId') reviewId: string,
  ) {
    return await this.reviewProductoService.addReviewProducto(
      reviewId,
      productoId,
    );
  }

  @Get(':productoId/reviews/:reviewId')
  async findReviewByProductoIdReviewId(
    @Param('productoId') productoId: string,
    @Param('reviewId') reviewId: string,
  ) {
    return await this.reviewProductoService.findReviewByProductoIdReviewId(
      reviewId,
      productoId,
    );
  }

  @Get(':productoId/reviews')
  async findReviewsByProductoId(@Param('productoId') productoId: string) {
    return await this.reviewProductoService.findReviewsByProductoId(productoId);
  }

  @Put(':productoId/reviews')
  async associateReviewsProducto(
    @Body() reviewsDto: ReviewDto[],
    @Param('productoId') productoId: string,
  ) {
    const reviews = plainToInstance(ReviewEntity, reviewsDto);
    return await this.reviewProductoService.associateReviewsProducto(
      productoId,
      reviews,
    );
  }

  @Delete(':productoId/reviews/:reviewId')
  @HttpCode(204)
  async deleteReviewProducto(
    @Param('productoId') productoId: string,
    @Param('reviewId') reviewId: string,
  ) {
    return await this.reviewProductoService.deleteReviewProducto(
      reviewId,
      productoId,
    );
  }
}

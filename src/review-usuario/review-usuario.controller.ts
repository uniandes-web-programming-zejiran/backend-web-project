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
import { ReviewUsuarioService } from './review-usuario.service';

@Controller('usuarios')
@UseInterceptors(BusinessErrorsInterceptor)
export class ReviewUsuarioController {
  constructor(private readonly reviewUsuarioService: ReviewUsuarioService) {}

  @Post(':usuarioId/reviews/:reviewId')
  async addReviewUsuario(
    @Param('usuarioId') usuarioId: string,
    @Param('reviewId') reviewId: string,
  ) {
    return await this.reviewUsuarioService.addReviewUsuario(
      reviewId,
      usuarioId,
    );
  }

  @Get(':usuarioId/reviews/:reviewId')
  async findReviewByUsuarioIdReviewId(
    @Param('usuarioId') usuarioId: string,
    @Param('reviewId') reviewId: string,
  ) {
    return await this.reviewUsuarioService.findReviewByUsuarioIdReviewId(
      reviewId,
      usuarioId,
    );
  }

  @Get(':usuarioId/reviews')
  async findReviewsByUsuarioId(@Param('usuarioId') usuarioId: string) {
    return await this.reviewUsuarioService.findReviewsByUsuarioId(usuarioId);
  }

  @Put(':usuarioId/reviews')
  async associateReviewsUsuario(
    @Body() reviewsDto: ReviewDto[],
    @Param('usuarioId') usuarioId: string,
  ) {
    const reviews = plainToInstance(ReviewEntity, reviewsDto);
    return await this.reviewUsuarioService.associateReviewsUsuario(
      usuarioId,
      reviews,
    );
  }

  @Delete(':usuarioId/reviews/:reviewId')
  @HttpCode(204)
  async deleteReviewUsuario(
    @Param('usuarioId') usuarioId: string,
    @Param('reviewId') reviewId: string,
  ) {
    return await this.reviewUsuarioService.deleteReviewUsuario(
      reviewId,
      usuarioId,
    );
  }
}

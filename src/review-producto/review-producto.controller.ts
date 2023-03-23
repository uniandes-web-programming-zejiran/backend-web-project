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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ReviewDto } from 'src/review/review.dto';
import { ReviewEntity } from 'src/review/review.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { ReviewProductoService } from './review-producto.service';
import { HasRoles } from '../auth/has-roles.decorator';
import { Role } from '../auth/role.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('productos')
@UseInterceptors(BusinessErrorsInterceptor)
export class ReviewProductoController {
  constructor(private readonly reviewProductoService: ReviewProductoService) {}

  @HasRoles(
    Role.AdminReview,
    Role.EscrituraReview,
    Role.AdminProducto,
    Role.EscrituraProducto,
  )
  @UseGuards(JwtAuthGuard, RolesGuard)
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

  @HasRoles(
    Role.AdminReview,
    Role.LecturaReview,
    Role.AdminProducto,
    Role.LecturaProducto,
  )
  @UseGuards(JwtAuthGuard, RolesGuard)
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

  @HasRoles(
    Role.AdminReview,
    Role.LecturaReview,
    Role.AdminProducto,
    Role.LecturaProducto,
  )
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':productoId/reviews')
  async findReviewsByProductoId(@Param('productoId') productoId: string) {
    return await this.reviewProductoService.findReviewsByProductoId(productoId);
  }

  @HasRoles(
    Role.AdminReview,
    Role.EscrituraReview,
    Role.AdminProducto,
    Role.EscrituraProducto,
  )
  @UseGuards(JwtAuthGuard, RolesGuard)
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

  @HasRoles(
    Role.AdminReview,
    Role.EliminarReview,
    Role.AdminProducto,
    Role.EliminarProducto,
  )
  @UseGuards(JwtAuthGuard, RolesGuard)
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

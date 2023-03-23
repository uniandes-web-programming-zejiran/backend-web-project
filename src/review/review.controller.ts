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
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { ReviewDto } from './review.dto';
import { ReviewEntity } from './review.entity';
import { ReviewService } from './review.service';
import { HasRoles } from '../auth/has-roles.decorator';
import { Role } from '../auth/role.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('reviews')
@UseInterceptors(BusinessErrorsInterceptor)
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @HasRoles(Role.AdminReview, Role.LecturaReview)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  async findAll() {
    return await this.reviewService.findAll();
  }

  @HasRoles(Role.AdminReview, Role.LecturaReview)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':reviewId')
  async findOne(@Param('reviewId') reviewId: string) {
    return await this.reviewService.findOne(reviewId);
  }

  @HasRoles(Role.AdminReview, Role.EscrituraReview)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  async create(@Body() reviewDto: ReviewDto) {
    const review: ReviewEntity = plainToInstance(ReviewEntity, reviewDto);
    return await this.reviewService.create(review);
  }

  @HasRoles(Role.AdminReview, Role.EscrituraReview)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':reviewId')
  async update(
    @Param('reviewId') reviewId: string,
    @Body() reviewDto: ReviewDto,
  ) {
    const review: ReviewEntity = plainToInstance(ReviewEntity, reviewDto);
    return await this.reviewService.update(reviewId, review);
  }

  @HasRoles(Role.AdminReview, Role.EliminarReview)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':reviewId')
  @HttpCode(204)
  async delete(@Param('reviewId') reviewId: string) {
    return await this.reviewService.delete(reviewId);
  }
}

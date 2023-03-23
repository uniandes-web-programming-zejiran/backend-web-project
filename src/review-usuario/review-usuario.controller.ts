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
import { ReviewUsuarioService } from './review-usuario.service';
import { HasRoles } from '../auth/has-roles.decorator';
import { Role } from '../auth/role.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('usuarios')
@UseInterceptors(BusinessErrorsInterceptor)
export class ReviewUsuarioController {
  constructor(private readonly reviewUsuarioService: ReviewUsuarioService) {}

  @HasRoles(
    Role.AdminReview,
    Role.EscrituraReview,
    Role.AdminUsuario,
    Role.EscrituraUsuario,
  )
  @UseGuards(JwtAuthGuard, RolesGuard)
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

  @HasRoles(
    Role.AdminReview,
    Role.LecturaReview,
    Role.AdminUsuario,
    Role.LecturaUsuario,
  )
  @UseGuards(JwtAuthGuard, RolesGuard)
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

  @HasRoles(
    Role.AdminReview,
    Role.LecturaReview,
    Role.AdminUsuario,
    Role.LecturaUsuario,
  )
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':usuarioId/reviews')
  async findReviewsByUsuarioId(@Param('usuarioId') usuarioId: string) {
    return await this.reviewUsuarioService.findReviewsByUsuarioId(usuarioId);
  }

  @HasRoles(
    Role.AdminReview,
    Role.EscrituraReview,
    Role.AdminUsuario,
    Role.EscrituraUsuario,
  )
  @UseGuards(JwtAuthGuard, RolesGuard)
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

  @HasRoles(
    Role.AdminReview,
    Role.EliminarReview,
    Role.AdminUsuario,
    Role.EliminarUsuario,
  )
  @UseGuards(JwtAuthGuard, RolesGuard)
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

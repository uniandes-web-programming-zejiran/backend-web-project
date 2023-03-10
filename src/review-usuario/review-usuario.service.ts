import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReviewEntity } from '../review/review.entity';
import { UsuarioEntity } from '../usuario/usuario.entity';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class ReviewUsuarioService {
  constructor(
    @InjectRepository(ReviewEntity)
    private readonly reviewRepository: Repository<ReviewEntity>,

    @InjectRepository(UsuarioEntity)
    private readonly usuarioRepository: Repository<UsuarioEntity>,
  ) {}
  async addReviewUsuario(
    reviewId: string,
    usuarioId: string,
  ): Promise<UsuarioEntity> {
    const usuario: UsuarioEntity = await this.usuarioRepository.findOne({
      where: { id: usuarioId },
      relations: ['reviews'],
    });
    if (!usuario)
      throw new BusinessLogicException(
        'El usuario con el id dado no fue encontrado',
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

    usuario.reviews = [...usuario.reviews, review];
    return await this.usuarioRepository.save(usuario);
  }

  async findReviewByUsuarioIdReviewId(
    reviewId: string,
    usuarioId: string,
  ): Promise<ReviewEntity> {
    const usuario: UsuarioEntity = await this.usuarioRepository.findOne({
      where: { id: usuarioId },
      relations: ['reviews'],
    });
    if (!usuario)
      throw new BusinessLogicException(
        'El usuario con el id dado no fue encontrado',
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

    const reviewUsuario: ReviewEntity = usuario.reviews.find(
      (e) => e.id === review.id,
    );

    if (!reviewUsuario)
      throw new BusinessLogicException(
        'El review con el id dado no está asociado al usuario',
        BusinessError.PRECONDITION_FAILED,
      );

    return reviewUsuario;
  }

  async findReviewsByProductId(usuarioId: string): Promise<ReviewEntity[]> {
    const usuario: UsuarioEntity = await this.usuarioRepository.findOne({
      where: { id: usuarioId },
      relations: ['reviews'],
    });
    if (!usuario)
      throw new BusinessLogicException(
        'El usuario con el id dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );

    return usuario.reviews;
  }

  async associateReviewsUsuario(
    usuarioId: string,
    reviews: ReviewEntity[],
  ): Promise<UsuarioEntity> {
    const usuario: UsuarioEntity = await this.usuarioRepository.findOne({
      where: { id: usuarioId },
      relations: ['reviews'],
    });

    if (!usuario)
      throw new BusinessLogicException(
        'El usuario con el id dado no fue encontrado',
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

    usuario.reviews = reviews;
    return await this.usuarioRepository.save(usuario);
  }

  async deleteReviewUsuario(reviewId: string, usuarioId: string) {
    const review: ReviewEntity = await this.reviewRepository.findOne({
      where: { id: reviewId },
    });
    if (!review)
      throw new BusinessLogicException(
        'The review with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const usuario: UsuarioEntity = await this.usuarioRepository.findOne({
      where: { id: usuarioId },
      relations: ['reviews'],
    });
    if (!usuario)
      throw new BusinessLogicException(
        'El usuario con el id dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );

    const reviewUsuario: ReviewEntity = usuario.reviews.find(
      (e) => e.id === review.id,
    );

    if (!reviewUsuario)
      throw new BusinessLogicException(
        'El review con el id dado no está asociado al usuario',
        BusinessError.PRECONDITION_FAILED,
      );

    usuario.reviews = usuario.reviews.filter((e) => e.id !== reviewId);
    await this.usuarioRepository.save(usuario);
  }
}

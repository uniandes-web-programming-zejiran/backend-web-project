import { Controller, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';
import { ReviewService } from './review.service';

@Controller('reviews')
@UseInterceptors(BusinessErrorsInterceptor)
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}
}

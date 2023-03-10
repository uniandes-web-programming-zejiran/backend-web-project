import { Controller, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';
import { EventoService } from './evento.service';

@Controller('eventos')
@UseInterceptors(BusinessErrorsInterceptor)
export class EventoController {
  constructor(private readonly eventoService: EventoService) {}
}

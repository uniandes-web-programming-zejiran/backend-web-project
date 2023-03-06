import { Test, TestingModule } from '@nestjs/testing';
import { NegocioEventoService } from './negocio-evento.service';

describe('NegocioEventoService', () => {
  let service: NegocioEventoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NegocioEventoService],
    }).compile();

    service = module.get<NegocioEventoService>(NegocioEventoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

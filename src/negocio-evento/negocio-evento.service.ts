import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NegocioEntity } from '../negocio/negocio.entity';
import { EventoEntity } from '../evento/evento.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class NegocioEventoService {

    constructor(
        @InjectRepository(NegocioEntity)
        private readonly negocioRepository: Repository<NegocioEntity>,
    
        @InjectRepository(EventoEntity)
        private readonly eventoRepository: Repository<EventoEntity>
    ) {}

    async addEventoNegocio(negocioId: string, eventoId: string): Promise<NegocioEntity> {
        const evento: EventoEntity = await this.eventoRepository.findOne({where: {id: eventoId}});
        if (!evento)
          throw new BusinessLogicException("El evento con el id dado no fue encontrado", BusinessError.NOT_FOUND);
      
        const negocio: NegocioEntity = await this.negocioRepository.findOne({where: {id: negocioId}, relations: ["productos", "eventos"]})
        if (!negocio)
          throw new BusinessLogicException("El negocio con el id dado no fue encontrado", BusinessError.NOT_FOUND);
    
        negocio.eventos = [...negocio.eventos, evento];
        return await this.negocioRepository.save(negocio);
      }
    
    async findEventoByNegocioIdEventoId(negocioId: string, eventoId: string): Promise<EventoEntity> {
        const evento: EventoEntity = await this.eventoRepository.findOne({where: {id: eventoId}});
        if (!evento)
          throw new BusinessLogicException("El evento con el id dado no fue encontrado", BusinessError.NOT_FOUND)
       
        const negocio: NegocioEntity = await this.negocioRepository.findOne({where: {id: negocioId}, relations: ["productos", "eventos"]});
        if (!negocio)
          throw new BusinessLogicException("El negocio con el id dado no fue encontrado", BusinessError.NOT_FOUND)
   
        const negocioEvento: EventoEntity = negocio.eventos.find(e => e.id === evento.id);
   
        if (!negocioEvento)
          throw new BusinessLogicException("El evento con el id dado no esta asociado al negocio", BusinessError.PRECONDITION_FAILED)
   
        return negocioEvento;
    }
    
    async findEventosByNegocioId(negocioId: string): Promise<EventoEntity[]> {
        const negocio: NegocioEntity = await this.negocioRepository.findOne({where: {id: negocioId}, relations: ["eventos"]});
        if (!negocio)
          throw new BusinessLogicException("El negocio con el id dado no fue encontrado", BusinessError.NOT_FOUND)
       
        return negocio.eventos;
    }
    
    async associateEventosNegocio(negocioId: string, eventos: EventoEntity[]): Promise<NegocioEntity> {
        const negocio: NegocioEntity = await this.negocioRepository.findOne({where: {id: negocioId}, relations: ["eventos"]});
    
        if (!negocio)
          throw new BusinessLogicException("El negocio con el id dado no fue encontrado", BusinessError.NOT_FOUND)
    
        for (let i = 0; i < eventos.length; i++) {
          const evento: EventoEntity = await this.eventoRepository.findOne({where: {id: eventos[i].id}});
          if (!evento)
            throw new BusinessLogicException("El evento con el id dado no fue encontrado", BusinessError.NOT_FOUND)
        }
    
        negocio.eventos = eventos;
        return await this.negocioRepository.save(negocio);
      }
    
    async deleteEventoNegocio(negocioId: string, eventoId: string){
        const evento: EventoEntity = await this.eventoRepository.findOne({where: {id: eventoId}});
        if (!evento)
          throw new BusinessLogicException("El evento con el id dado no fue encontrado", BusinessError.NOT_FOUND)
    
        const negocio: NegocioEntity = await this.negocioRepository.findOne({where: {id: negocioId}, relations: ["eventos"]});
        if (!negocio)
          throw new BusinessLogicException("El negocio con el id dado no fue encontrado", BusinessError.NOT_FOUND)
    
        const negocioEvento: EventoEntity = negocio.eventos.find(e => e.id === evento.id);
    
        if (!negocioEvento)
            throw new BusinessLogicException("El evento con el id dado no esta asociado al negocio", BusinessError.PRECONDITION_FAILED)
 
        negocio.eventos = negocio.eventos.filter(e => e.id !== eventoId);
        await this.negocioRepository.save(negocio);
    }  

}
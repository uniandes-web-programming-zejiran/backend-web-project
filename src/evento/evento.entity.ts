/* eslint-disable prettier/prettier */
import { NegocioEntity } from 'src/negocio/negocio.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class EventoEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    titulo: string;

    @Column()
    objetivo: string;

    @Column()
    lugar: string;

    @Column()
    fecha: string;

    @Column()
    imagen: string;

    @ManyToOne(() => NegocioEntity, negocio => negocio.eventos)
    negocio: NegocioEntity;
}

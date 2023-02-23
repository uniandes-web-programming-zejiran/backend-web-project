/* eslint-disable prettier/prettier */
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
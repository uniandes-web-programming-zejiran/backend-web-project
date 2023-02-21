/* eslint-disable prettier/prettier */
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class NegocioEntity {
 @PrimaryGeneratedColumn('uuid')
 id: string;

 @Column()
 nombre: string;
 
 @Column()
 tipo: string;
 
 @Column()
 ubicacion: string;
 
 @Column()
 fechaCreacion: string;

 @Column()
 imagen: string;
}

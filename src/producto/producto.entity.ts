/* eslint-disable prettier/prettier */
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ProductoEntity {
 @PrimaryGeneratedColumn('uuid')
 id: string;

 @Column()
 nombre: string;
 
 @Column()
 precio: number;
 
 @Column()
 stock: number;
 
 @Column()
 categoria: string;

 @Column()
 imagen: string;
}
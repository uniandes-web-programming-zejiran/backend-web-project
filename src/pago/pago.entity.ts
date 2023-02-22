/* eslint-disable prettier/prettier */
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PagoEntity {
 @PrimaryGeneratedColumn('uuid')
 id: string;
 
 @Column()
 monto: GLfloat;
 
 @Column()
 pagado: boolean;
}
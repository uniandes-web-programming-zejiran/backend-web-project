/* eslint-disable prettier/prettier */
import { ProductoEntity } from '../producto/producto.entity';
import { EventoEntity } from '../evento/evento.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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

  @OneToMany(() => ProductoEntity, (producto) => producto.negocio)
  productos: ProductoEntity[];

  @OneToMany(() => EventoEntity, (evento) => evento.negocio)
  eventos: EventoEntity[];
}

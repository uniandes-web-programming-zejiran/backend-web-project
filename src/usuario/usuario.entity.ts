/* eslint-disable prettier/prettier */
import { PublicacionEntity } from '../publicacion/publicacion.entity';
import { PedidoEntity } from '../pedido/pedido.entity';
import { ReviewEntity } from '../review/review.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UsuarioEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  cedula: string;

  @Column()
  nombre: string;

  @Column()
  fechaInscripcion: string;

  @Column()
  fechaNacimiento: string;

  @Column()
  imagen: string;

  @OneToMany(() => ReviewEntity, (review) => review.usuario)
  reviews: ReviewEntity[];

  @OneToMany(() => PublicacionEntity, (publicacion) => publicacion.usuario)
  publicaciones: PublicacionEntity[];

  @OneToMany(() => PedidoEntity, (pedido) => pedido.usuario)
  pedidos: PedidoEntity[];
}

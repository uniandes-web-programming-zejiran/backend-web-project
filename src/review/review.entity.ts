/* eslint-disable prettier/prettier */
import { ProductoEntity } from '../producto/producto.entity';
import { UsuarioEntity } from '../usuario/usuario.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class ReviewEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  titulo: string;

  @Column()
  descripcion: string;

  @Column()
  puntaje: string;

  @Column()
  imagen: string;

  @Column()
  fecha: string;

  @ManyToOne(() => UsuarioEntity, (usuario) => usuario.reviews)
  usuario: UsuarioEntity;

  @ManyToOne(() => ProductoEntity, (producto) => producto.reviews)
  producto: ProductoEntity;
}

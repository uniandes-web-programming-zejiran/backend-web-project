/* eslint-disable prettier/prettier */
import { UsuarioEntity } from '../usuario/usuario.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PublicacionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  titulo: string;

  @Column()
  cuerpo: string;

  @Column()
  fechaPublicacion: string;

  @Column()
  imagen: string;

  @ManyToOne(() => UsuarioEntity, (usuario) => usuario.publicaciones)
  usuario: UsuarioEntity;
}

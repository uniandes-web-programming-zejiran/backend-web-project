/* eslint-disable prettier/prettier */
import { UsuarioEntity } from '../usuario/usuario.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class PublicacionEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    titulp: string;

    @Column()
    cuerpo: string;

    @Column()
    fechaPubliacion: string;

    @Column()
    imagen: string;

    @ManyToOne(() => UsuarioEntity, usuario => usuario.publicaciones)
    usuario: UsuarioEntity;
}

/* eslint-disable prettier/prettier */
import { ProductoEntity } from 'src/producto/producto.entity';
import { UsuarioEntity } from 'src/usuario/usuario.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToMany, OneToOne } from 'typeorm';

@Entity()
export class CarritoEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    total: number;

    @Column()
    fechaCreacion: string;

    @OneToOne(()=> UsuarioEntity, usuario => usuario.carrito)
    usuario: UsuarioEntity;

    @OneToMany(() => ProductoEntity, producto => producto.carritos)
    productos: ProductoEntity[];
}



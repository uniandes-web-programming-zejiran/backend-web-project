/* eslint-disable prettier/prettier */
import { ProductoEntity } from 'src/producto/producto.entity';
import { UsuarioEntity } from 'src/usuario/usuario.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PedidoEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre: string;

    @Column()
    fecha: string;

    @Column()
    monto: GLfloat;

    @ManyToOne(() => UsuarioEntity, usuario => usuario.pedidos)
    usuario: UsuarioEntity;

    @ManyToMany(() => ProductoEntity, producto => producto.pedidos)
    @JoinTable()
    productos:  ProductoEntity[];
}

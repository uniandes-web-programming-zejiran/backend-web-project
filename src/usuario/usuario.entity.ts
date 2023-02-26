/* eslint-disable prettier/prettier */
import { CarritoEntity } from 'src/carrito/carrito.entity';
import { PedidoEntity } from 'src/pedido/pedido.entity';
import { ReviewEntity } from 'src/review/review.entity';
import { Column, Entity, PrimaryGeneratedColumn, OneToMany, OneToOne, JoinColumn } from 'typeorm'

@Entity()
export class UsuarioEntity {

    @PrimaryGeneratedColumn()
    cedula: string;

    @Column()
    nombre: string

    @Column()
    fechaInscripcion: string

    @Column()
    fechaNacimiento: string

    @Column()
    imagen: string

    @OneToMany(() => ReviewEntity, review => review.usuario)
    reviews: ReviewEntity[];

    @OneToOne(() => CarritoEntity, carrito => carrito.usuario)
    @JoinColumn()
    carrito: CarritoEntity;

    @OneToMany(() => PedidoEntity, pedido => pedido.usuario)
    pedidos: PedidoEntity[];
}

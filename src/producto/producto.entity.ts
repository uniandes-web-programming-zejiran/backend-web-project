/* eslint-disable prettier/prettier */
import { PedidoEntity } from '../pedido/pedido.entity';
import { NegocioEntity } from '../negocio/negocio.entity';
import { CarritoEntity } from '../carrito/carrito.entity';
import { ReviewEntity } from '../review/review.entity';
import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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

 @ManyToMany(() => PedidoEntity, pedido => pedido.productos)
 pedidos: PedidoEntity[];

 @ManyToOne(() => NegocioEntity, negocio => negocio.productos)
 negocio: NegocioEntity;

 @OneToMany(() => ReviewEntity, review => review.producto)
 reviews: ReviewEntity[];

 @ManyToMany(() => CarritoEntity, carrito => carrito.productos)
 carritos: CarritoEntity[];

}
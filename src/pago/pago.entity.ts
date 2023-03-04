/* eslint-disable prettier/prettier */
import { PedidoEntity } from '../pedido/pedido.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PagoEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    monto: GLfloat;

    @Column()
    pagado: boolean;

    @OneToOne(() => PedidoEntity, pedido => pedido.pago)
    pedido: PedidoEntity
}

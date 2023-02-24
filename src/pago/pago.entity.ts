/* eslint-disable prettier/prettier */
import { PedidoEntity } from 'src/pedido/pedido.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';

@Entity()
export class PagoEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    monto: GLfloat;

    @Column()
    pagado: boolean;
    
    @OneToOne(()=> PedidoEntity, pedido => pedido.pago)
    pedido: PedidoEntity

}
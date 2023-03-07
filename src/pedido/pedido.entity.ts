/* eslint-disable prettier/prettier */
import { PagoEntity } from '../pago/pago.entity';
import { ProductoEntity } from '../producto/producto.entity';
import { UsuarioEntity } from '../usuario/usuario.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class PedidoEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fecha: string;

  @Column()
  monto: GLfloat;

  @Column()
  estado: string;

  @ManyToOne(() => UsuarioEntity, (usuario) => usuario.pedidos)
  usuario: UsuarioEntity;

  @ManyToMany(() => ProductoEntity, (producto) => producto.pedidos)
  @JoinTable()
  productos: ProductoEntity[];

  @OneToOne(() => PagoEntity, (pago) => pago.pedido)
  @JoinColumn()
  pago: PagoEntity;
}

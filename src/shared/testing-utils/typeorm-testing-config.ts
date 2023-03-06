/* eslint-disable prettier/prettier */
import { TypeOrmModule } from "@nestjs/typeorm";
import { EventoEntity } from "../../evento/evento.entity";
import { NegocioEntity } from "../../negocio/negocio.entity";
import { PagoEntity } from "../../pago/pago.entity";
import { PedidoEntity } from "../../pedido/pedido.entity";
import { ProductoEntity } from "../../producto/producto.entity";
import { PublicacionEntity } from "../../publicacion/publicacion.entity";
import { ReviewEntity } from "../../review/review.entity";
import { UsuarioEntity } from "../../usuario/usuario.entity";

export const TypeOrmTestingConfig = () => [
    
    TypeOrmModule.forRoot({
        type: 'sqlite',
        database: ':memory:',
        dropSchema: true,
        entities: [
            UsuarioEntity, 
            EventoEntity, 
            NegocioEntity,
            PagoEntity, 
            PedidoEntity, 
            ProductoEntity, 
            PublicacionEntity, 
            ReviewEntity],

        synchronize: true,
        keepConnectionAlive: true
    }),
    TypeOrmModule.forFeature([
        UsuarioEntity, 
        EventoEntity, 
        NegocioEntity,
        PagoEntity, 
        PedidoEntity, 
        ProductoEntity, 
        PublicacionEntity, 
        ReviewEntity])
];
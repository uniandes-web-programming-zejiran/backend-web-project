import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { UsuarioEntity } from '../usuario/usuario.entity';
import { PedidoEntity } from '../pedido/pedido.entity';

@Injectable()
export class UsuarioPedidoService {

    constructor(
        @InjectRepository(UsuarioEntity)
        private readonly usuarioRepository: Repository<UsuarioEntity>,

        @InjectRepository(PedidoEntity)
        private readonly pedidoRepository: Repository<PedidoEntity>
    ) { }

    //Añadir un pedido a un usuario
    async addPedidoUsuario(idUsuario: string, idPedido: string) {
        const pedido: PedidoEntity = await this.pedidoRepository.findOne({where: {id: idPedido}});
        if(!pedido) {
            throw new BusinessLogicException("El pedido con el id dado no fue encontrado", BusinessError.NOT_FOUND);
        }

        const usuario: UsuarioEntity = await this.usuarioRepository.findOne({where: {id: idUsuario}, relations: ["publicaciones", "pedidos", "reviews"]});
        if(!usuario) {
            throw new BusinessLogicException("El usuario con la id dada no fue encontrado", BusinessError.NOT_FOUND);
        }

        usuario.pedidos = [...usuario.pedidos, pedido];
        return await this.usuarioRepository.save(usuario);
    }

    //Encontrar todos los pedidos de un usuario por su id y el id de la pedido
    async findPedidoByUsuarioIdPedidoId(idUsuario: string, idPedido: string) {
        const pedido: PedidoEntity = await this.pedidoRepository.findOne({where: {id: idPedido}});
        if(!pedido) {
            throw new BusinessLogicException("El pedido con el id dado no fue encontrado", BusinessError.NOT_FOUND);
        }

        const usuario: UsuarioEntity = await this.usuarioRepository.findOne({where: {id: idUsuario}, relations: ["pedidos"]});
        if(!usuario) {
            throw new BusinessLogicException("El usuario con la id dada no fue encontrado", BusinessError.NOT_FOUND);
        }

        const usuarioPedido: PedidoEntity = usuario.pedidos.find(e => e.id === pedido.id);
        if(!usuarioPedido) {
            throw new BusinessLogicException("El pedido con el id dado no está asociado al usuario", BusinessError.NOT_FOUND);
        }

        return usuarioPedido;
    }

    //Encontrar todos los pedidos de un usuario por su id
    async findPedidoByUsuarioId(idUsuario: string) {
        const usuario: UsuarioEntity = await this.usuarioRepository.findOne({where: {id: idUsuario}, relations: ["pedidos"]});
        if(!usuario) {
            throw new BusinessLogicException("El usuario con la id dada no fue encontrado", BusinessError.NOT_FOUND);
        }
        return usuario.pedidos;
    }

    // Asociar un arreglo de pedidos a un usuario
    async associatePedidoUsuario(idUsuario: string, pedidos: PedidoEntity[]): Promise<UsuarioEntity> {
        const usaurio: UsuarioEntity = await this.usuarioRepository.findOne({where: {id: idUsuario}, relations: ["pedidos"]});
        if(!usaurio) {
            throw new BusinessLogicException("El usuario con la id dada no fue encontrado", BusinessError.NOT_FOUND);
        }

        for (let i = 0; i < pedidos.length; i++) {
            const pedido: PedidoEntity = await this.pedidoRepository.findOne({where: {id: pedidos[i].id}});
            if(!pedido) {
                throw new BusinessLogicException("El pedido con el id dado no fue encontrado", BusinessError.NOT_FOUND);
            }
        }

        usaurio.pedidos = pedidos;
        return await this.usuarioRepository.save(usaurio);
    }

    //Eliminar un pedido de un usuario
    async deletePedidoUsuario(idUsuario: string, idPedido: string) {
        const pedido: PedidoEntity = await this.pedidoRepository.findOne({where: {id: idPedido}});
        if(!pedido) {
            throw new BusinessLogicException("El pedido con el id dado no fue encontrado", BusinessError.NOT_FOUND);
        }

        const usuario: UsuarioEntity = await this.usuarioRepository.findOne({where: {id: idUsuario}, relations: ["pedidos"]});
        if(!usuario) {
            throw new BusinessLogicException("El usuario con la id dada no fue encontrado", BusinessError.NOT_FOUND);
        }

        const usuarioPedido: PedidoEntity = usuario.pedidos.find(e => e.id === pedido.id);
        if(!usuarioPedido) {
            throw new BusinessLogicException("El pedido con el id dado no está asociado al usuario", BusinessError.NOT_FOUND);
        }

        usuario.pedidos = usuario.pedidos.filter(e => e.id !== idPedido);
        return await this.usuarioRepository.save(usuario);
    }
}

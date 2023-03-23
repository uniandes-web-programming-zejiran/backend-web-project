import { Injectable } from '@nestjs/common';
import { User } from './user';
import { Role } from '../auth/role.enum';

@Injectable()
export class UserService {
  private users: User[] = [
    new User(1, 'adminNegocio', 'adminNegocio', [Role.AdminNegocio]),
    new User(2, 'lecturaNegocio', 'lecturaNegocio', [Role.LecturaNegocio]),
    new User(3, 'escrituraNegocio', 'escrituraNegocio', [Role.EscrituraNegocio]),
    new User(4, 'eliminarNegocio', 'eliminarNegocio', [Role.EliminarNegocio]),
    new User(5, 'adminProducto', 'adminProducto', [Role.AdminProducto]),
    new User(6, 'lecturaProducto', 'lecturaProducto', [Role.LecturaProducto]),
    new User(7, 'escrituraProducto', 'escrituraProducto', [Role.EscrituraProducto]),
    new User(8, 'eliminarProducto', 'eliminarProducto', [Role.EliminarProducto]),
    new User(9, 'adminReview', 'adminReview', [Role.AdminReview]),
    new User(10, 'lecturaReview', 'lecturaReview', [Role.LecturaReview]),
    new User(11, 'escrituraReview', 'escrituraReview', [Role.EscrituraReview]),
    new User(12, 'eliminarReview', 'eliminarReview', [Role.EliminarReview]),
    new User(13, 'adminEvento', 'adminEvento', [Role.AdminEvento]),
    new User(14, 'lecturaEvento', 'lecturaEvento', [Role.LecturaEvento]),
    new User(15, 'escrituraEvento', 'escrituraEvento', [Role.EscrituraEvento]),
    new User(16, 'eliminarEvento', 'eliminarEvento', [Role.EliminarEvento]),
    new User(17, 'adminPago', 'adminPago', [Role.AdminPago]),
    new User(18, 'lecturaPago', 'lecturaPago', [Role.LecturaPago]),
    new User(19, 'escrituraPago', 'escrituraPago', [Role.EscrituraPago]),
    new User(20, 'eliminarPago', 'eliminarPago', [Role.EliminarPago]),
    new User(21, 'adminPedido', 'adminPedido', [Role.AdminPedido]),
    new User(22, 'lecturaPedido', 'lecturaPedido', [Role.LecturaPedido]),
    new User(23, 'escrituraPedido', 'escrituraPedido', [Role.EscrituraPedido]),
    new User(24, 'eliminarPedido', 'eliminarPedido', [Role.EliminarPedido]),
    new User(25, 'adminUsuario', 'adminUsuario', [Role.AdminUsuario]),
    new User(26, 'lecturaUsuario', 'lecturaUsuario', [Role.LecturaUsuario]),
    new User(27, 'escrituraUsuario', 'escrituraUsuario', [Role.EscrituraUsuario]),
    new User(28, 'eliminarUsuario', 'eliminarUsuario', [Role.EliminarUsuario]),
    new User(29, 'adminPublicacion', 'adminPublicacion', [Role.AdminPublicacion]),
    new User(30, 'lecturaPublicacion', 'lecturaPublicacion', [Role.LecturaPublicacion]),
    new User(31, 'escrituraPublicacion', 'escrituraPublicacion', [Role.EscrituraPublicacion]),
    new User(32, 'eliminarPublicacion', 'eliminarPublicacion', [Role.EliminarPublicacion]),
  ];

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find((user) => user.username === username);
  }
}

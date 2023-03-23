import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { RolesGuard } from '../auth/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { HasRoles } from '../auth/has-roles.decorator';
import { Role } from '../auth/role.enum';
import { ProductoDto } from '../producto/producto.dto';
import { ProductoEntity } from '../producto/producto.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { NegocioProductoService } from './negocio-producto.service';

@Controller('negocios')
@UseInterceptors(BusinessErrorsInterceptor)
export class NegocioProductoController {
  constructor(
    private readonly negocioProductoService: NegocioProductoService,
  ) {}

  @HasRoles(Role.AdminNegocio, Role.EscrituraNegocio, Role.AdminProducto, Role.EscrituraProducto)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post(':negocioId/productos/:productoId')
  async addProductoNegocio(
    @Param('negocioId') negocioId: string,
    @Param('productoId') productoId: string,
  ) {
    return await this.negocioProductoService.addProductoNegocio(
      negocioId,
      productoId,
    );
  }

  @HasRoles(Role.AdminNegocio, Role.LecturaNegocio, Role.AdminProducto, Role.LecturaProducto)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':negocioId/productos/:productoId')
  async findProductoByNegocioIdProductoId(
    @Param('negocioId') negocioId: string,
    @Param('productoId') productoId: string,
  ) {
    return await this.negocioProductoService.findProductoByNegocioIdProductoId(
      negocioId,
      productoId,
    );
  }

  @HasRoles(Role.AdminNegocio, Role.LecturaNegocio, Role.AdminProducto, Role.LecturaProducto)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':negocioId/productos')
  async findProductosByNegocioId(@Param('negocioId') negocioId: string) {
    return await this.negocioProductoService.findProductosByNegocioId(
      negocioId,
    );
  }

  @HasRoles(Role.AdminNegocio, Role.EscrituraNegocio, Role.AdminProducto, Role.EscrituraProducto)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':negocioId/productos')
  async associateProductosNegocio(
    @Body() productosDto: ProductoDto[],
    @Param('negocioId') negocioId: string,
  ) {
    const productos = plainToInstance(ProductoEntity, productosDto);
    return await this.negocioProductoService.associateProductosNegocio(
      negocioId,
      productos,
    );
  }

  @HasRoles(Role.AdminNegocio, Role.EliminarNegocio, Role.AdminProducto, Role.EliminarProducto)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':negocioId/productos/:productoId')
  @HttpCode(204)
  async deleteProductoNegocio(
    @Param('negocioId') negocioId: string,
    @Param('productoId') productoId: string,
  ) {
    return await this.negocioProductoService.deleteProductoNegocio(
      negocioId,
      productoId,
    );
  }
}

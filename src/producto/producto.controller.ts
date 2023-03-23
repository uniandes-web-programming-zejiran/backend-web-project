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
import { Role } from '../auth/role.enum';
import { HasRoles } from '../auth/has-roles.decorator';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { ProductoDto } from './producto.dto';
import { ProductoEntity } from './producto.entity';
import { ProductoService } from './producto.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@Controller('productos')
@UseInterceptors(BusinessErrorsInterceptor)
export class ProductoController {
  constructor(private readonly productoService: ProductoService) {}

  @HasRoles(Role.AdminProducto, Role.LecturaProducto)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  async findAll() {
    return await this.productoService.findAll();
  }

  @HasRoles(Role.AdminProducto, Role.LecturaProducto)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':productoId')
  async findOne(@Param('productoId') productoId: string) {
    return await this.productoService.findOne(productoId);
  }

  @HasRoles(Role.AdminProducto, Role.EscrituraProducto)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  async create(@Body() productoDto: ProductoDto) {
    const producto: ProductoEntity = plainToInstance(
      ProductoEntity,
      productoDto,
    );
    return await this.productoService.create(producto);
  }

  @HasRoles(Role.AdminProducto, Role.EscrituraProducto)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':productoId')
  async update(
    @Param('productoId') productoId: string,
    @Body() productoDto: ProductoDto,
  ) {
    const producto: ProductoEntity = plainToInstance(
      ProductoEntity,
      productoDto,
    );
    return await this.productoService.update(productoId, producto);
  }

  @HasRoles(Role.AdminProducto, Role.EliminarProducto)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':productoId')
  @HttpCode(204)
  async delete(@Param('productoId') productoId: string) {
    return await this.productoService.delete(productoId);
  }
}

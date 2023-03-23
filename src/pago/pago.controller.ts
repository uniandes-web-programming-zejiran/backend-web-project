/* eslint-disable prettier/prettier */
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
import { PagoDto } from './pago.dto';
import { PagoEntity } from './pago.entity';
import { PagoService } from './pago.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@Controller('pagos')
@UseInterceptors(BusinessErrorsInterceptor)
export class PagoController {
  constructor(private readonly pagoService: PagoService) {}

  @HasRoles(Role.AdminPago, Role.LecturaPago)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  async findAll() {
    return await this.pagoService.findAll();
  }

  @HasRoles(Role.AdminPago, Role.LecturaPago)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':pagoId')
  async findOne(@Param('pagoId') pagoId: string) {
    return await this.pagoService.findOne(pagoId);
  }

  @HasRoles(Role.AdminPago, Role.EscrituraPago)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  async create(@Body() pagoDto: PagoDto) {
    const pago: PagoEntity = plainToInstance(PagoEntity, pagoDto);
    return await this.pagoService.create(pago);
  }

  @HasRoles(Role.AdminPago, Role.EscrituraPago)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':pagoId')
  async update(@Param('pagoId') pagoId: string, @Body() pagoDto: PagoDto) {
    const pago: PagoEntity = plainToInstance(PagoEntity, pagoDto);
    return await this.pagoService.update(pagoId, pago);
  }

  @HasRoles(Role.AdminPago, Role.EliminarPago)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':pagoId')
  @HttpCode(204)
  async delete(@Param('pagoId') pagoId: string) {
    return await this.pagoService.delete(pagoId);
  }
}

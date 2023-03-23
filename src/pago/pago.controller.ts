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
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { PagoDto } from './pago.dto';
import { PagoEntity } from './pago.entity';
import { PagoService } from './pago.service';

@Controller('pagos')
@UseInterceptors(BusinessErrorsInterceptor)
export class PagoController {
  constructor(private readonly pagoService: PagoService) {}

  @Get()
  async findAll() {
    return await this.pagoService.findAll();
  }

  @Get(':pagoId')
  async findOne(@Param('pagoId') pagoId: string) {
    return await this.pagoService.findOne(pagoId);
  }

  @Post()
  async create(@Body() pagoDto: PagoDto) {
    const pago: PagoEntity = plainToInstance(PagoEntity, pagoDto);
    return await this.pagoService.create(pago);
  }

  @Put(':pagoId')
  async update(@Param('pagoId') pagoId: string, @Body() pagoDto: PagoDto) {
    const pago: PagoEntity = plainToInstance(PagoEntity, pagoDto);
    return await this.pagoService.update(pagoId, pago);
  }

  @Delete(':pagoId')
  @HttpCode(204)
  async delete(@Param('pagoId') pagoId: string) {
    return await this.pagoService.delete(pagoId);
  }
}

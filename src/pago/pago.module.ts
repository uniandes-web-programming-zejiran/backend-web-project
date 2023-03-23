import { Module } from '@nestjs/common';
import { PagoEntity } from './pago.entity';
import { PagoService } from './pago.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PagoController } from './pago.controller';

@Module({
  providers: [PagoService],
  imports: [TypeOrmModule.forFeature([PagoEntity])],
  controllers: [PagoController],
})
export class PagoModule {}

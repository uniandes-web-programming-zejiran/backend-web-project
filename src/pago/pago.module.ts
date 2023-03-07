import { Module } from '@nestjs/common';
import { PagoEntity } from './pago.entity';
import { PagoService } from './pago.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [PagoService],
  imports: [TypeOrmModule.forFeature([PagoEntity])],
})
export class PagoModule {}

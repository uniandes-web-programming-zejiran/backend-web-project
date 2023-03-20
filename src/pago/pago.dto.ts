/* eslint-disable prettier/prettier */
import {  IsNotEmpty } from 'class-validator';
export class PagoDto {
  @IsNotEmpty()
  readonly monto: GLfloat;

  @IsNotEmpty()
  readonly pagado: boolean;
}


/* eslint-disable prettier/prettier */
import {  IsNotEmpty, IsString} from 'class-validator';
export class PedidoDto {
  @IsString()
  @IsNotEmpty()
  readonly fecha: string;

  @IsNotEmpty()
  readonly monto: GLfloat;

  @IsString()
  @IsNotEmpty()
  readonly estado: string;
}

/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString } from 'class-validator';
export class EventoDto {
  @IsString()
  @IsNotEmpty()
  readonly titulo: string;

  @IsString()
  @IsNotEmpty()
  readonly objetivo: string;

  @IsString()
  @IsNotEmpty()
  readonly lugar: string;

  @IsString()
  @IsNotEmpty()
  readonly fecha: string;

  @IsString()
  @IsNotEmpty()
  readonly imagen: string;
}

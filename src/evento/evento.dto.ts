/* eslint-disable prettier/prettier */
import { IsDate, IsNotEmpty, IsString, IsUrl } from 'class-validator';
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

  @IsDate()
  @IsNotEmpty()
  readonly fecha: string;

  @IsUrl()
  @IsNotEmpty()
  readonly imagen: string;
}

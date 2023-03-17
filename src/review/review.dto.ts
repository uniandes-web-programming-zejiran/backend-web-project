/* eslint-disable prettier/prettier */
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUrl,
} from 'class-validator';
export class ReviewDto {
  @IsString()
  @IsNotEmpty()
  readonly titulo: string;

  @IsString()
  @IsNotEmpty()
  readonly descripcion: string;

  @IsNumber()
  @IsNotEmpty()
  readonly puntaje: string;

  @IsUrl()
  @IsNotEmpty()
  readonly imagen: string;

  @IsString()
  @IsNotEmpty()
  readonly fecha: string;
}

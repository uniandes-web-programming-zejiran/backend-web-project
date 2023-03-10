/* eslint-disable prettier/prettier */
import {
  IsDate,
  IsDecimal,
  IsNotEmpty,
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

  @IsDecimal()
  @IsNotEmpty()
  readonly puntaje: string;

  @IsUrl()
  @IsNotEmpty()
  readonly imagen: string;

  @IsDate()
  @IsNotEmpty()
  readonly fecha: string;
}

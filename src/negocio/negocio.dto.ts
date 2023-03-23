import { IsNotEmpty, IsString } from 'class-validator';
export class NegocioDto {
  @IsString()
  @IsNotEmpty()
  readonly nombre: string;

  @IsString()
  @IsNotEmpty()
  readonly tipo: string;

  @IsString()
  @IsNotEmpty()
  readonly ubicacion: string;

  @IsString()
  @IsNotEmpty()
  readonly fechaCreacion: string;

  @IsString()
  @IsNotEmpty()
  readonly imagen: string;
}

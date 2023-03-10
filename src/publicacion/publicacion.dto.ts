import { IsString, IsNotEmpty } from 'class-validator';

export class PublicacionDto {
    @IsString()
    @IsNotEmpty()
    readonly titulo: string;

    @IsString()
    @IsNotEmpty()
    readonly cuerpo: string;

    @IsString()
    @IsNotEmpty()
    readonly imagen: string;

    @IsString()
    @IsNotEmpty()
    readonly fechaPublicacion: string;
}

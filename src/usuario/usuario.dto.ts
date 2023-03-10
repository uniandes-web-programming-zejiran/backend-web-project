import { IsNotEmpty, IsString } from 'class-validator';


export class UsuarioDto {

    @IsString()
    @IsNotEmpty()
    readonly cedula: string;

    @IsString()
    @IsNotEmpty()
    readonly nombre: string;

    @IsString()
    @IsNotEmpty()
    readonly fechaInscripcion: string;

    @IsString()
    @IsNotEmpty()
    readonly fechaNacimiento: string;

    @IsString()
    @IsNotEmpty()
    readonly imagen: string;

}

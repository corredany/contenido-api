import { IsString, IsEmail, IsInt, IsOptional, MinLength } from 'class-validator';

export class CrearUsuarioDto {
  @IsString()
  nombre!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  contrasena!: string;

  @IsInt()
  rolId!: number;
}

export class ActualizarUsuarioDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  contrasena?: string;

  @IsOptional()
  @IsInt()
  rolId?: number;
}

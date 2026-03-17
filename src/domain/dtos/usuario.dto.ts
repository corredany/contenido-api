export interface CrearUsuarioDto {
  nombre: string;
  email: string;
  contrasena: string;
  rolId: number;
}

export interface ActualizarUsuarioDto {
  nombre?: string;
  email?: string;
  contrasena?: string;
  rolId?: number;
}
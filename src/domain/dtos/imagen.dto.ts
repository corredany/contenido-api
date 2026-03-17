export interface SubirImagenDto {
  seccionId?: number;
  orden?: number;
}

export interface ActualizarImagenDto {
  seccionId?: number | null;
  orden?: number;
}
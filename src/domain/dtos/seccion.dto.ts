export interface CrearSeccionDto {
  nombre: string;
  descripcionPrincipal?: string;
  descripcionSeccion?: string;
  orden?: number;
}

export interface ActualizarSeccionDto {
  nombre?: string;
  descripcionPrincipal?: string;
  descripcionSeccion?: string;
  visible?: boolean;
  orden?: number;
}

export interface ActualizarOrdenDto {
  id: number;
  orden: number;
}
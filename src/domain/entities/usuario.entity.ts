export class Usuario {
  id: number;
  nombre: string;
  email: string;
  contrasena: string;
  rolId: number;
  creadoPor: number | null;
  actualizadoPor: number | null;
  creadoEn: Date;
  actualizadoEn: Date;

  constructor(data: Partial<Usuario>) {
    Object.assign(this, data);
  }

  tieneRol(rolId: number): boolean {
    return this.rolId === rolId;
  }
}
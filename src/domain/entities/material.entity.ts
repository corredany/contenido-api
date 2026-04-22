export class Material {
  id!: number;
  url!: string;
  publicId!: string;
  orden!: number;
  seccionId!: number | null;
  creadoPor!: number | null;
  actualizadoPor!: number | null;
  creadoEn!: Date;
  actualizadoEn!: Date;

  constructor(data: Partial<Material>) {
    Object.assign(this, data);
  }
}

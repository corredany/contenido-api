import { IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class SubirMaterialDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  seccionId?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  orden?: number;
}

export class ActualizarMaterialDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  seccionId?: number | null;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  orden?: number;
}

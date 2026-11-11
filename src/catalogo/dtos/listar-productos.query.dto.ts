import { IsEnum, IsOptional } from 'class-validator';
import { RamoSeguro } from '../enums/ramo-seguro.enum';

export class ListarProductosQueryDto {
  /** Filtra el catalogo por ramo de seguro. */
  @IsOptional()
  @IsEnum(RamoSeguro)
  ramo?: RamoSeguro;
}

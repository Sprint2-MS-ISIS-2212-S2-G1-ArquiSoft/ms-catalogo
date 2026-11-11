import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { RamoSeguro } from '../enums/ramo-seguro.enum';

/**
 * Producto de seguro ofrecido en el catalogo de Solventa.
 *
 * La relacion @OneToMany hacia Cotizacion que existia en el monolito se
 * elimino: Cotizacion vive en otro microservicio y la llave foranea queda
 * de su lado como una columna de id.
 */
@Entity('productos_seguro')
export class ProductoSeguro {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  nombre!: string;

  @Column({ type: 'enum', enum: RamoSeguro })
  ramo!: RamoSeguro;

  /** Suma asegurada maxima que ampara el producto. */
  @Column({ type: 'numeric', precision: 14, scale: 2 })
  sumaAseguradaMaxima!: string;
}

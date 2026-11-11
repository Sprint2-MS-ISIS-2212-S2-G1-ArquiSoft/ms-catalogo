import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isUUID } from 'class-validator';
import { Repository } from 'typeorm';
import { ProductoSeguro } from './entities/producto-seguro.entity';
import { RamoSeguro } from './enums/ramo-seguro.enum';

@Injectable()
export class CatalogoService {
  constructor(
    @InjectRepository(ProductoSeguro)
    private readonly productoRepository: Repository<ProductoSeguro>,
  ) {}

  async getProducto(idProducto: string): Promise<ProductoSeguro> {
    // La columna id es uuid: consultar con un id mal formado revienta en
    // Postgres, asi que un id invalido se trata como inexistente (404).
    if (!isUUID(idProducto)) {
      throw new NotFoundException(`Producto de seguro con id ${idProducto} no encontrado`);
    }
    const producto = await this.productoRepository.findOne({ where: { id: idProducto } });
    if (!producto) {
      throw new NotFoundException(`Producto de seguro con id ${idProducto} no encontrado`);
    }
    return producto;
  }

  async listarProductos(ramo?: RamoSeguro): Promise<ProductoSeguro[]> {
    return this.productoRepository.find({
      where: ramo ? { ramo } : {},
      order: { nombre: 'ASC' },
    });
  }

  listarRamos(): RamoSeguro[] {
    return Object.values(RamoSeguro);
  }
}

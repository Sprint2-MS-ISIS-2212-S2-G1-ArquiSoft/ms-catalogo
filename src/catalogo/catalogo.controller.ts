import { Controller, Get, Param, Query } from '@nestjs/common';
import { CatalogoService } from './catalogo.service';
import { ListarProductosQueryDto } from './dtos/listar-productos.query.dto';
import { ProductoSeguro } from './entities/producto-seguro.entity';
import { RamoSeguro } from './enums/ramo-seguro.enum';

@Controller()
export class CatalogoController {
  constructor(private readonly catalogoService: CatalogoService) {}

  @Get('productos')
  listarProductos(@Query() query: ListarProductosQueryDto): Promise<ProductoSeguro[]> {
    return this.catalogoService.listarProductos(query.ramo);
  }

  /** Sin ParseUUIDPipe a proposito: el 404 lo decide el servicio. */
  @Get('productos/:id')
  getProducto(@Param('id') id: string): Promise<ProductoSeguro> {
    return this.catalogoService.getProducto(id);
  }

  @Get('ramos')
  listarRamos(): RamoSeguro[] {
    return this.catalogoService.listarRamos();
  }
}

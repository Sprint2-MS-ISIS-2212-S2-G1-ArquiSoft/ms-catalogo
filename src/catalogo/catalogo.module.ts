import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatalogoController } from './catalogo.controller';
import { CatalogoService } from './catalogo.service';
import { ProductoSeguro } from './entities/producto-seguro.entity';

/**
 * Dominio de Catalogo: productos de seguro ofrecidos y sus ramos.
 */
@Module({
  imports: [TypeOrmModule.forFeature([ProductoSeguro])],
  controllers: [CatalogoController],
  providers: [CatalogoService],
  exports: [CatalogoService],
})
export class CatalogoModule {}

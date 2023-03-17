import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ProductoDto } from '../producto/producto.dto';
import { ProductoEntity } from '../producto/producto.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { NegocioProductoService } from './negocio-producto.service';

@Controller('negocios')
@UseInterceptors(BusinessErrorsInterceptor)
export class NegocioProductoController {

    constructor(private readonly negocioProductoService: NegocioProductoService){}

    @Post(':negocioId/productos/:productoId')
    async addProductoNegocio(@Param('negocioId') negocioId: string, @Param('productoId') productoId: string){
       return await this.negocioProductoService.addProductoNegocio(negocioId, productoId);
    }

    @Get(':negocioId/productos/:productoId')
    async findProductoByNegocioIdProductoId(@Param('negocioId') negocioId: string, @Param('productoId') productoId: string){
       return await this.negocioProductoService.findProductoByNegocioIdProductoId(negocioId, productoId);
    }

    @Get(':negocioId/productos')
    async findProductosByNegocioId(@Param('negocioId') negocioId: string){
       return await this.negocioProductoService.findProductosByNegocioId(negocioId);
    }

    @Put(':negocioId/productos')
    async associateProductosNegocio(@Body() productosDto: ProductoDto[], @Param('negocioId') negocioId: string){
       const productos = plainToInstance(ProductoEntity, productosDto)
       return await this.negocioProductoService.associateProductosNegocio(negocioId, productos);
    }

    @Delete(':negocioId/productos/:productoId')
    @HttpCode(204)
    async deleteProductoNegocio(@Param('negocioId') negocioId: string, @Param('productoId') productoId: string){
       return await this.negocioProductoService.deleteProductoNegocio(negocioId, productoId);
    }


}

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { GetCategoryDto } from '../categories/dto/get-category.dto';
import { IdValidationPipe } from '../common/pipes/id-validation/id-validation.pipe';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll(@Query() params: GetCategoryDto) {
    const { categoryId, take, skip } = params;
    const category = categoryId ? categoryId : null;
    const takeValue = take ? take : 10;
    const skipValue = skip ? skip : 0;

    return this.productsService.findAll(category!, takeValue, skipValue);
  }

  @Get(':id')
  findOne(@Param('id', IdValidationPipe) id: string) {
    return this.productsService.findOneProduct(+id);
  }

  @Patch(':id')
  update(
    @Param('id', IdValidationPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id', IdValidationPipe) id: string) {
    return this.productsService.remove(+id);
  }
}

import { PartialType } from '@nestjs/mapped-types';
import { IsInt, IsNumber, IsOptional, IsString } from 'class-validator';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @IsOptional()
  @IsString({ message: 'El campo name de producto debe ser de tipo string' })
  name: string;

  @IsOptional()
  @IsNumber(
    {
      maxDecimalPlaces: 2,
    },
    { message: 'El campo price de producto debe ser de tipo number' },
  )
  price: number;

  @IsOptional()
  @IsString({ message: 'El campo image de producto debe ser de tipo string' })
  image: string;

  @IsOptional()
  @IsInt({
    message: 'El campo inventory  de producto debe ser de tipo integer',
  })
  inventory: number;

  @IsOptional()
  @IsInt({ message: 'El campo categoryId de producto debe ser de tipo entero' })
  categoryId: number;
}

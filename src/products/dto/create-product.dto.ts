import { IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty({ message: 'El campo name de producto es requerido' })
  @IsString({ message: 'El campo name de producto debe ser de tipo string' })
  name: string;

  @IsNotEmpty({ message: 'El campo price de producto es requerido' })
  @IsNumber(
    {
      maxDecimalPlaces: 2,
    },
    { message: 'El campo price de producto debe ser de tipo number' },
  )
  price: number;

  @IsNotEmpty({ message: 'El campo image de producto es requerido' })
  @IsString({ message: 'El campo image de producto debe ser de tipo string' })
  image: string;

  @IsNotEmpty({ message: 'El campo inventory de producto es requerido' })
  @IsInt({
    message: 'El campo inventory  de producto debe ser de tipo integer',
  })
  inventory: number;

  @IsInt({ message: 'El campo categoryId de producto debe ser de tipo entero' })
  @IsNotEmpty({ message: 'El campo categoryId es requerido' })
  categoryId: number;
}

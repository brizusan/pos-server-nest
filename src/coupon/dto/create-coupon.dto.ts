import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  Length,
  Max,
  Min,
} from 'class-validator';

export class CreateCouponDto {
  @IsNotEmpty({ message: 'El campo nombre es requerido' })
  @Length(10, 30, {
    message: 'El campo nombre debe tener entre 10 y 30 caracteres',
  })
  name: string;

  @IsNotEmpty({ message: 'El campo descuento es requerido' })
  @IsInt({ message: 'El campo descuento debe ser de tipo number' })
  @Max(100, { message: 'El descuento maximo es 100%' })
  @Min(1, { message: 'El descuento minimo es 1%' })
  discount: number;

  @IsNotEmpty({ message: 'El campo fecha de expiracion es requerido' })
  @IsDateString({}, { message: 'Fecha ingresada no valida' })
  expirationDate: Date;
}

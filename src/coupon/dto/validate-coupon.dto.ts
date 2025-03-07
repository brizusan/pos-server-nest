import { IsNotEmpty, IsString } from 'class-validator';

export class ValidateCouponDto {
  @IsNotEmpty({ message: 'El campo name es requerido' })
  @IsString({ message: 'El campo name debe ser de tipo string' })
  name: string;
}

import { IsNumberString, IsOptional } from 'class-validator';

export class GetCategoryDto {
  @IsOptional()
  @IsNumberString(
    {},
    { message: 'El campo categoryId debe ser de tipo number' },
  )
  categoryId: number;

  @IsOptional()
  @IsNumberString({}, { message: 'El campo take debe ser de tipo number' })
  take: number;

  @IsOptional()
  @IsNumberString({}, { message: 'El campo skip debe ser de tipo number' })
  skip: number;
}

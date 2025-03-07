import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { IdValidationPipe } from '../common/pipes/id-validation/id-validation.pipe';
import { CouponService } from './coupon.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { ValidateCouponDto } from './dto/validate-coupon.dto';

@Controller('coupon')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Post()
  create(@Body() createCouponDto: CreateCouponDto) {
    return this.couponService.create(createCouponDto);
  }

  @Get()
  findAll() {
    return this.couponService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id', IdValidationPipe)
    id: string,
  ) {
    return this.couponService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id', IdValidationPipe)
    id: string,
    @Body() updateCouponDto: UpdateCouponDto,
  ) {
    return this.couponService.update(+id, updateCouponDto);
  }

  @Delete(':id')
  remove(
    @Param('id', IdValidationPipe)
    id: string,
  ) {
    return this.couponService.remove(+id);
  }

  @Post('/apply-coupon')
  @HttpCode(200)
  validate(@Body() validateCouponDto: ValidateCouponDto) {
    return this.couponService.validate(validateCouponDto);
  }
}

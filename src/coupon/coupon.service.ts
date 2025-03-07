import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { endOfDay, isAfter, parseISO } from 'date-fns';
import { Repository } from 'typeorm';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { ValidateCouponDto } from './dto/validate-coupon.dto';
import { Coupon } from './entities/coupon.entity';

@Injectable()
export class CouponService {
  constructor(
    @InjectRepository(Coupon)
    private readonly couponRepository: Repository<Coupon>,
  ) {}

  async create(createCouponDto: CreateCouponDto) {
    const coupon = new Coupon();
    coupon.name = createCouponDto.name;
    coupon.discount = createCouponDto.discount;
    coupon.expirationDate = parseISO(createCouponDto.expirationDate.toString());
    await this.couponRepository.save(coupon);
    return { message: 'Cupón creado exitosamente' };
  }

  findAll() {
    return this.couponRepository.find();
  }

  async findOne(id: number) {
    const coupon = await this.couponRepository.findOne({ where: { id: id } });
    if (!coupon) throw new NotFoundException('Cupón no encontrado');
    return coupon;
  }

  async update(id: number, updateCouponDto: UpdateCouponDto) {
    const coupon = await this.findOne(id);
    Object.assign(coupon, updateCouponDto);
    await this.couponRepository.update(id, coupon);
    return { message: 'Cupón actualizado exitosamente' };
  }

  async remove(id: number) {
    const coupon = await this.findOne(id);
    await this.couponRepository.remove(coupon);
    return { message: 'Cupón eliminado exitosamente' };
  }

  async validate(validateCouponDto: ValidateCouponDto) {
    const { name } = validateCouponDto;
    const coupon = await this.couponRepository.findOneBy({ name: name });
    if (!coupon) throw new NotFoundException('Cupón no valido');
    const currentDate = new Date();
    const expirationDate = endOfDay(coupon.expirationDate);

    if (isAfter(currentDate, expirationDate))
      throw new UnprocessableEntityException('Cupón ya expirado');

    return { message: 'Cupón canjeado exitosamente', ...coupon };
  }
}

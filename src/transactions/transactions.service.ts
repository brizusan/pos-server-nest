import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { endOfDay, isValid, parseISO, startOfDay } from 'date-fns';
import { Between, FindManyOptions, Repository } from 'typeorm';
import { CouponService } from '../coupon/coupon.service';
import { Product } from '../products/entities/product.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction, TransactionContent } from './entities/transaction.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(TransactionContent)
    private readonly transactionContentRepository: Repository<TransactionContent>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    private readonly couponService: CouponService,
  ) {}

  async create(createTransactionDto: CreateTransactionDto) {
    await this.productRepository.manager.transaction(async (manager) => {
      const transaction = new Transaction();
      // Calculate Total de transaction
      const total = createTransactionDto.contents.reduce(
        (acum, total) => acum + total.price * total.quantity,
        0,
      );
      transaction.total = total;

      if (createTransactionDto.coupon) {
        const coupon = await this.couponService.validate({
          name: createTransactionDto.coupon,
        });
        const discount = (coupon.discount / 100) * total;
        transaction.discount = discount;
        transaction.coupon = createTransactionDto.coupon;
        transaction.total = total - discount;
      }

      for (const contents of createTransactionDto.contents) {
        const { productId } = contents;
        const product = await manager.findOneBy(Product, {
          id: productId.toString(),
        });
        const errors: string[] = [];
        if (!product) {
          errors.push(`Producto con id ${contents.productId} , no encontrado`);
          throw new NotFoundException(errors);
        }

        if (contents.quantity > product.inventory) {
          errors.push(`Producto  ${product.name} , no disponible`);
          throw new BadRequestException(errors);
        }

        product.inventory -= contents.quantity;

        // Create Instance of TransactionContent
        const transactionContent = new TransactionContent();
        transactionContent.quantity = contents.quantity;
        transactionContent.price = contents.price;
        transactionContent.product = product;
        transactionContent.transaction = transaction;

        // Save Transaction
        await manager.save(transaction);
        await manager.save(transactionContent);
      }
    });

    return { message: 'Venta creada exitosamente' };
  }

  findAll(transactionDate?: string) {
    const options: FindManyOptions<Transaction> = {
      relations: ['contents'],
    };

    if (transactionDate) {
      const date = parseISO(transactionDate);
      if (!isValid(date)) throw new BadRequestException('Fecha no valida');

      // tomar ventas del dia
      const startDay = startOfDay(date);
      const endDay = endOfDay(date);

      options.where = {
        transactionDate: Between(startDay, endDay),
      };
    }

    return this.transactionRepository.find(options);
  }

  async findOne(id: number) {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
      relations: ['contents'],
    });
    if (!transaction) throw new NotFoundException('Venta no encontrada');

    return transaction;
  }

  // update(id: number, updateTransactionDto: UpdateTransactionDto) {
  //   return `This action updates a #${id} transaction`;
  // }

  async remove(id: number) {
    const transaction = await this.findOne(id);

    for (const content of transaction.contents) {
      // reestabler stock de producto de venta cancelada
      const product = await this.productRepository.findOneBy({
        id: content.product.id,
      });
      product!.inventory += content.quantity;
      await this.productRepository.save(product!);

      const transactionContents =
        await this.transactionContentRepository.findOneBy({ id: content.id });
      await this.transactionContentRepository.remove(transactionContents!);
    }

    await this.transactionRepository.remove(transaction);
    return { message: 'Venta cancelada correctamente' };
  }
}

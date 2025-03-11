import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../categories/entities/category.entity';
import { UploadImageModule } from '../upload-image/upload-image.module';
import { Product } from './entities/product.entity';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category]), UploadImageModule],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}

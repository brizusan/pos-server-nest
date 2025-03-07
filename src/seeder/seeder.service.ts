import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Category } from '../categories/entities/category.entity';
import { Product } from '../products/entities/product.entity';
import { categories } from './data/categories';
import { products } from './data/products';

@Injectable()
export class SeederService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    // limpia base de datos
    private datasource: DataSource,
  ) {}

  async onModuleInit() {
    const con = this.datasource;
    await con.dropDatabase();
    await con.synchronize();
  }

  async seed() {
    await this.categoryRepository.save(categories);
    for await (const seedProduct of products) {
      const category = await this.categoryRepository.findOneBy({
        id: seedProduct.categoryId,
      });
      const product = new Product();
      product.name = seedProduct.name;
      product.price = seedProduct.price;
      product.inventory = seedProduct.inventory;
      product.image = seedProduct.image;
      product.category = category!;
      await this.productRepository.save(product);
    }
  }
}

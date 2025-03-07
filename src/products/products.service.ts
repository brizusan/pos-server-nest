import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { Category } from '../categories/entities/category.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const category = await this.categoryRepository.findOneBy({
      id: createProductDto.categoryId,
    });
    if (!category) {
      let errors: string[] = [];
      errors.push('Categoria no encontrada');
      throw new NotFoundException(errors);
    }
    return this.productRepository.save({
      ...createProductDto,
      category,
    });
  }

  async findAll(categoryId: number, take: number, skip: number) {
    const options: FindManyOptions<Product> = {
      relations: ['category'],
      order: { id: 'ASC' },
      take,
      skip,
    };
    if (categoryId) {
      const category = await this.categoryRepository.findOneBy({
        id: categoryId,
      });
      if (!category) {
        let errors: string[] = [];
        errors.push('Categoria no encontrada');
        throw new NotFoundException(errors);
      }
      options.where = { category };
    }
    const [products, total] =
      await this.productRepository.findAndCount(options);

    return { products, total };
  }

  async findOneProduct(id: number) {
    const product = await this.productRepository.findOne({
      where: { id: id.toString() },
      relations: ['category'],
    });
    if (!product)
      throw new NotFoundException(`Producto con id ${id} , no encontrado`);
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.findOneProduct(id);
    Object.assign(product, updateProductDto);

    if (updateProductDto.categoryId) {
      const category = await this.categoryRepository.findOneBy({
        id: updateProductDto.categoryId,
      });
      if (!category) {
        let errors: string[] = [];
        errors.push('Categoria no encontrada');
        throw new NotFoundException(errors);
      }
      product.category = category;
    }

    await this.productRepository.save(product);
    return 'Producto Actualizado';
  }

  async remove(id: number) {
    const product = await this.findOneProduct(id);
    await this.productRepository.remove(product);
    return 'Producto Eliminado';
  }
}

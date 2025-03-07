import { Controller, Get, Patch, Post, Put } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post()
  postHello(): string {
    return this.appService.postHello();
  }

  @Put()
  putHello(): string {
    return 'desde put hello';
  }

  @Patch()
  patchHello(): string {
    return 'desde patch hello';
  }
}

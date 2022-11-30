import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('example-1')
  example() {
    return this.appService.example();
  }

  @Get('example-2')
  example2() {
    return this.appService.example2();
  }
}

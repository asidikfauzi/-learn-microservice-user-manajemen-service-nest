import { Body, Controller, Get, HttpCode, Ip, Post, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateUserDTO } from './dtos';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  @HttpCode(201)
  createUser(@Req() req: Request, @Body() body: CreateUserDTO, @Ip() ip) {
    return this.appService.createUser(req, body, ip)
  }
}

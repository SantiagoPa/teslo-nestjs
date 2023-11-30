import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SeedService } from './seed.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Post()
  executeSeed() {
    return this.seedService.runSeed();
  }

}

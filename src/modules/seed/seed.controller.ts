import { Body, Controller, Delete, Get, UseGuards } from '@nestjs/common';
import { SeedService } from './seed.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get('ous')
  ouCreateData() {
    return this.seedService.ouLoadData();
  }

  // @Delete('ous')
  // userDeleteData(@Body() selectedUids) {
  //   return this.seedService.userDeleteData(selectedUids);
  // }

  @Get('users')
  userCreateData() {
    return this.seedService.userLoadData();
  }

  @Delete('users')
  userDeleteData(@Body() selectedUids) {
    return this.seedService.userDeleteData(selectedUids);
  }

  @Get('groups')
  groupCreateData() {
    return this.seedService.groupLoadData();
  }

  @Delete('groups')
  groupDeleteData(@Body() selectedCns) {
    return this.seedService.groupDeleteData(selectedCns);
  }
}
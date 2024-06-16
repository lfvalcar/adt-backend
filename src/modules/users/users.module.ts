import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { OneService } from '../one/one.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService,OneService],
})
export class UsersModule {}

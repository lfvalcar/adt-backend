import { Module } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { OneService } from '../one/one.service';

@Module({
  controllers: [GroupsController],
  providers: [GroupsService,OneService]
})
export class GroupsModule {}

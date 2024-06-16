import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { OusService } from '../ous/ous.service';
import { OneService } from '../one/one.service';
import { UsersService } from '../users/users.service';
import { GroupsService } from '../groups/groups.service';

@Module({
  controllers: [SeedController],
  providers: [SeedService,OusService,OneService,UsersService,GroupsService],
})
export class SeedModule {}

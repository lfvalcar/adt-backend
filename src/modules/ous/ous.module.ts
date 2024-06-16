import { Module } from '@nestjs/common';
import { OusService } from './ous.service';
import { OusController } from './ous.controller';
import { OneService } from '../one/one.service';

@Module({
  controllers: [OusController],
  providers: [OusService,OneService]
})
export class OusModule {}

import { Module } from '@nestjs/common';
import { OneService } from './one.service';

@Module({
  providers: [OneService],
  exports: [OneService]
})
export class OneModule {}

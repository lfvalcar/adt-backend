import { Test, TestingModule } from '@nestjs/testing';
import { OusController } from './ous.controller';
import { OusService } from './ous.service';

describe('OusController', () => {
  let controller: OusController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OusController],
      providers: [OusService],
    }).compile();

    controller = module.get<OusController>(OusController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

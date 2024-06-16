import { Test, TestingModule } from '@nestjs/testing';
import { OusService } from './ous.service';

describe('OusService', () => {
  let service: OusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OusService],
    }).compile();

    service = module.get<OusService>(OusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { ClicksService } from './clicks.service';
import { PrismaModule } from '../../src/prisma/prisma.module';
import { LinksModule } from '../../src/links/links.module';

describe('ClicksService', () => {
  let service: ClicksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClicksService],
      imports: [PrismaModule, LinksModule],
    }).compile();

    service = module.get<ClicksService>(ClicksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

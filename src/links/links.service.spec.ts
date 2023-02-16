import { Test, TestingModule } from '@nestjs/testing';
import { LinksService } from './links.service';
import { PrismaModule } from '../../src/prisma/prisma.module';

describe('LinksService', () => {
  let service: LinksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LinksService],
      imports: [PrismaModule],
    }).compile();

    service = module.get<LinksService>(LinksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

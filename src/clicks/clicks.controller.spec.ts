import { Test, TestingModule } from '@nestjs/testing';
import { ClicksController } from './clicks.controller';
import { ClicksService } from './clicks.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { LinksService } from '../../src/links/links.service';

describe('ClicksController', () => {
  let controller: ClicksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClicksController],
      providers: [ClicksService, PrismaService, LinksService],
    }).compile();

    controller = module.get<ClicksController>(ClicksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

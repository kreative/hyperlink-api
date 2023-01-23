import { Module } from '@nestjs/common';
import { LinksModule } from 'src/links/links.module';
import { ClicksController } from './clicks.controller';
import { ClicksService } from './clicks.service';

@Module({
  imports: [LinksModule],
  controllers: [ClicksController],
  providers: [ClicksService],
  exports: [ClicksService]
})
export class ClicksModule {}

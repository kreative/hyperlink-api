import { Controller, Get, Param, Req } from '@nestjs/common';
import logger from '../../utils/logger';
import { ClicksService } from './clicks.service';
import { IClickDataRequest } from '../../types/IClickDataRequest';
import { IResponse } from '../../types/IResponse';

@Controller('clicks')
export class ClicksController {
  constructor(private clicksService: ClicksService) {}

  @Get('transform/:extension')
  async transformAndCreateClick(
    @Req() req: IClickDataRequest,
    @Param('extension') extension: string,
  ): Promise<IResponse> {
    // creates a new click object, updates the link clickCount, and sends back target
    logger.info(`GET /${extension} in ClicksController initiated`);
    return this.clicksService.transformAndCreateClick(req, extension);
  }
}

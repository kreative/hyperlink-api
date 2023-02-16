import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Req,
} from '@nestjs/common';
import logger from '../../utils/logger';
import { ClicksService } from './clicks.service';
import { IClientIpinfoRequest } from '../../types/IClientIpinfoRequest';
import { IResponse } from '../../types/IResponse';

@Controller('clicks')
export class ClicksController {
  constructor(private clicksService: ClicksService) {}

  @Get('transform/:extension')
  @HttpCode(HttpStatus.OK)
  async transformAndCreateClick(
    @Req() req: IClientIpinfoRequest,
    @Param('extension') extension: string,
  ): Promise<IResponse> {
    // creates a new click object, updates the link clickCount, and sends back target
    logger.info(`GET /${extension} in ClicksController initiated`);
    return this.clicksService.transformAndCreateClick(req, extension);
  }
}

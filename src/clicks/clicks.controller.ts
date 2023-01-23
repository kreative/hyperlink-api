import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import logger from '../../utils/logger';
import { ClicksService } from './clicks.service';
import { IClientIpinfoRequest } from '../../types/IClientIpinfoRequest';
import { IResponse } from '../../types/IResponse';

// since the clicks controller is used to transform a link from an extension to a redirect
// this controller has to be empty from a global Controller class perspective
@Controller('')
export class ClicksController {
  constructor(private clicksService: ClicksService) {}

  @Get(':extension')
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

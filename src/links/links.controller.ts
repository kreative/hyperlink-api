import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';

import { IResponse } from 'types/IResponse';
import logger from 'utils/logger';
import { NewLinkDto, UpdateLinkDto } from './links.dto';
import { LinksService } from './links.service';

@Controller('links')
export class LinksController {
  constructor(private linksService: LinksService) {}

  // TODO: bulk deactivate link
  // TODO: make a link your "favorite" in the dashboard
  // TODO: add tags to a link, update tags, remove them

  @Post('ghost')
  @HttpCode(HttpStatus.OK)
  async createGhostLink(@Body() dto: NewLinkDto): Promise<IResponse> {
    // creates a new link that doesn't belong to any user
    logger.info(`POST /links/ghost inititated with body: ${dto}`);
    return this.linksService.createGhostLink(dto);
  }

  @Post('user')
  @HttpCode(HttpStatus.OK)
  async createUserLink(@Body() dto: NewLinkDto): Promise<IResponse> {
    // create a new account link (requires authentication)
    // authentication for this method will happen in some sort of middleware
    // therefore the "ksn" and user details will come from cookies/headers
    // but not from the POST requst body, only the target for the new link
    logger.info(`POST /links/user initiated with body: ${dto}`);
    return this.linksService.createUserLink(dto);
  }

  @Post(':id')
  @HttpCode(HttpStatus.OK)
  async updateLink(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateLinkDto,
  ): Promise<IResponse> {
    // update details for a link, like target and extension with a given ID
    logger.info(`POST /${id} initiated with body: ${dto}`);
    return this.linksService.updateLink(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deactivateLink(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<IResponse> {
    // deactivate link, basically deleting a link using the ID
    logger.info(`DELETE /${id} initiated`);
    return this.linksService.deactivateLink(id);
  }
}

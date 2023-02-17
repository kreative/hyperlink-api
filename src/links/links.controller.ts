import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Req,
  Query,
} from '@nestjs/common';
import { IAuthenticatedRequest } from 'types/IAuthenticatedRequest';

import { IResponse } from '../../types/IResponse';
import logger from '../../utils/logger';
import { NewLinkDto, UpdateLinkDto, GetAppQueryDto } from './links.dto';
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
    logger.info({ message: `POST /links/ghost inititated`, body: dto });
    return this.linksService.createGhostLink(dto);
  }

  @Post('user')
  @HttpCode(HttpStatus.OK)
  async createUserLink(
    @Req() req: IAuthenticatedRequest,
    @Body() dto: NewLinkDto,
  ): Promise<IResponse> {
    // create a new account link (requires authentication)
    // authentication for this method will happen in some sort of middleware
    // therefore the "ksn" and user details will come from cookies/headers
    // but not from the POST requst body, only the target for the new link
    logger.info({ message: `POST /links/user initiated`, body: dto });
    return this.linksService.createUserLink(req, dto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getLink(@Param('id', ParseIntPipe) id: number): Promise<IResponse> {
    // get a link by ID
    logger.info(`GET /links/${id} initiated`);
    return this.linksService.getLink(id);
  }


  @Get('')
  @HttpCode(HttpStatus.OK)
  async getLinks(
    @Req() req: IAuthenticatedRequest,
    @Query() query: GetAppQueryDto,
  ): Promise<IResponse> {
    // this controller gets all of the links that our database currently holds
    // eventually this method will be modified to get all links held by a certain KSN
    logger.info(`GET /links initiated`);
    return this.linksService.getLinks(req, query);
  }

  @Post(':id')
  @HttpCode(HttpStatus.OK)
  async updateLink(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateLinkDto,
  ): Promise<IResponse> {
    // update details for a link, like target and extension with a given ID
    logger.info({ message: `POST /${id} initiated`, body: dto });
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

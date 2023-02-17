import { ForbiddenException, Injectable } from '@nestjs/common';
import { Link } from '@prisma/client';
import { customAlphabet } from 'nanoid';
import { IAuthenticatedRequest } from 'types/IAuthenticatedRequest';
import { PrismaService } from '../../src/prisma/prisma.service';
import { IResponse } from '../../types/IResponse';
import { handlePrismaErrors } from '../../utils/handlePrismaErrors';
import { getFavicon } from '../../utils/getFavicon';
import { getTitleTag } from '../../utils/getTitleTag';
import logger from '../../utils/logger';
import { GetAppQueryDto, NewLinkDto, UpdateLinkDto } from './links.dto';

@Injectable()
export class LinksService {
  constructor(private prisma: PrismaService) {}

  // creates a new, unique application id number
  async generateExtension(): Promise<string> {
    let unique = false;
    let newExt = '';
    const characters = 'abcdefghijklmnopqrstuvwxyz1234567890';
    // create new 'nanoid' function with custom parameters
    const nanoid = customAlphabet(characters, 6);
    // loop to create a compltely unique ksn
    while (!unique) {
      // create new random ksn from function
      newExt = nanoid() as string;
      // tries to find a link in the database from the new extension
      logger.info(`prisma.link.findUnique in generateExtension initiated`);
      const link = await this.prisma.link.findUnique({
        where: { extension: newExt },
      });
      // checks to see if the link sent back is empty or not
      if (link === null) unique = true;
    }

    logger.info(`new extension ${newExt} generated`);
    return newExt;
  }

  // creates a link that doesn't belong to any user,
  async createGhostLink(dto: NewLinkDto): Promise<IResponse> {
    let link: Link;

    // creates a new, unique link extension
    const extension: string = await this.generateExtension();

    try {
      // creates a new link without modify default values
      logger.info(`prisma.link.create in createGhostLink initiated`);
      link = await this.prisma.link.create({
        data: {
          target: dto.target,
          extension,
        },
      });
    } catch (error) {
      // handles any errors thrown by prisma
      logger.error({
        message: `prisma.link.create in createGhostLink failed`,
        error,
      });
      handlePrismaErrors(error);
    }

    const payload: IResponse = {
      statusCode: 200,
      message: 'Ghost link created',
      data: { link },
    };

    logger.info({ message: `createGhostLink passed`, payload });
    return payload;
  }

  // for now this method will return a positive response
  // when we add authentication, this method will be able to work
  async createUserLink(
    req: IAuthenticatedRequest,
    dto: NewLinkDto,
  ): Promise<IResponse> {
    // empty link object that will store new link created
    let link: Link;
    // empty favicon string that will store the favicon url
    let favicon: string;

    // modifying certain default values from the schema
    const ghost = false;
    const ksn: number = req.kreativeAccount.ksn;
    const isPublic: boolean = dto.public || false;

    // creates a new, unique extension
    const extension: string = await this.generateExtension();

    try {
      // gets the favicon from the target url
      logger.info(`getFavicon in createUserLink initiated for ${dto.target}`);
      favicon = await getFavicon(dto.target);
    } catch (error) {
      // some sort of error occured while getting the favicon
      // sets the favicon to an empty string and logs the error
      favicon = '';
      logger.error({
        message: `getFavicon in createUserLink failed for ${dto.target}`,
        error,
      });
    }

    // gets the title tag from getTitleTag utility file
    // if the utility doesn't work for some reason, titleTag will be set to 'Untitled'
    const titleTag = await getTitleTag(dto.target);

    try {
      // creates a new link in the database using prisma
      logger.info(`prisma.link.create in createUserLink initiated`);
      link = await this.prisma.link.create({
        data: {
          target: dto.target,
          public: isPublic,
          titleTag,
          favicon,
          extension,
          ksn,
          ghost,
        },
      });
    } catch (error) {
      // some sort of prisma error occured and has been handled
      logger.error({
        message: 'prisma.link.create in createUserLink failed',
        error,
      });
      handlePrismaErrors(error);
    }

    console.log(favicon);

    const payload: IResponse = {
      statusCode: 200,
      message: 'User link created',
      data: { link },
    };

    logger.info({ message: 'createUserLink passed', payload });
    return payload;
  }

  // returns data for a single link from the database
  async getLink(id: number): Promise<IResponse> {
    // empty link object that will store the link data
    let link: Link;

    try {
      // attempts to retrieve a link from the database
      logger.info(`prisma.link.findUnique in getLink initiated for ${id}`);
      link = await this.prisma.link.findUnique({
        where: { id },
      });
    } catch (error) {
      // some sort of prisma error occured and has been handled
      logger.error({
        message: `prisma.link.findUnique in getLink failed for ${id}`,
        error,
      });
      handlePrismaErrors(error);
    }

    const payload: IResponse = {
      statusCode: 200,
      message: 'Link retrieved',
      data: { link },
    };

    logger.info({ message: 'getLink passed', payload });
    return payload;
  }

  // returns ALL links in the Hyperlink database for a specific user
  // eventually we need to implement pagination
  async getLinks(
    req: IAuthenticatedRequest,
    query: GetAppQueryDto,
  ): Promise<IResponse> {
    // empty links array object that will be used to store data
    let links: Link[];
    // empty number that will be used to store total count
    let totalLinks: number;

    // gets the ksn from the request object
    const ksn: number = req.kreativeAccount.ksn;
    // gets pagination data from the query object
    const { limit, page } = query;

    try {
      // attempts to retrieve all links in the database
      // we have to pull active links only has "active" tracks whether a user has deleted a link
      logger.info(`prisma.links.findMany initiated for ${ksn}`);
      links = await this.prisma.link.findMany({
        where: { ksn, active: true },
        skip: page * limit - limit,
        take: limit,
      });
    } catch (error) {
      // some sort of prisma error occured
      logger.error({
        message: `prisma.links.findMany failed for ${ksn}`,
        error,
      });
      handlePrismaErrors(error);
    }

    try {
      // attempts to retrieve the total number of links in the database
      logger.info(`prisma.links.count initiated for ${ksn}`);
      totalLinks = await this.prisma.link.count({
        where: { ksn, active: true },
      });
    } catch (error) {
      // some sort of prisma error occured
      logger.error({
        message: `prisma.links.count failed for ${ksn}`,
        error,
      });
      handlePrismaErrors(error);
    }

    const payload: IResponse = {
      statusCode: 200,
      message: 'Links found',
      data: { links, totalLinks },
    };

    logger.info({ message: `getLinks passed`, payload });
    return payload;
  }

  // updates target and extension for a link with a given id
  // in the client side, if only the target or the extension is updated and not the other
  // the client will still send both over tho this method
  async updateLink(id: number, dto: UpdateLinkDto): Promise<IResponse> {
    let link: Link;
    let linkChange: any;
    // empty favicon string that will store the favicon url
    let favicon: string;

    try {
      // gets the favicon from the target url
      logger.info(`getFavicon in createUserLink initiated for ${dto.target}`);
      favicon = await getFavicon(dto.target);
    } catch (error) {
      // some sort of error occured while getting the favicon
      // sets the favicon to an empty string and logs the error
      favicon = '';
      logger.error({
        message: `getFavicon in createUserLink failed for ${dto.target}`,
        error,
      });
    }

    // here we check to see if the extension that was sent over is unique
    // since this method would also take an unchanged extension, we use extensionChanged to know when to check
    // we assume that the extensionChanged variable is correctly sent over by the client
    // the client needs to send 'true' only if the extension is actually changed
    if (dto.extensionChanged) {
      try {
        // tries to find a link with the given extension
        logger.info(`prisma.link.findUnique for :${dto.extension} initiated`);
        link = await this.prisma.link.findUnique({
          where: { extension: dto.extension },
        });
      } catch (error) {
        // handles any prisma errors that come up
        logger.error({
          message: `prisma.link.findUnique for :${dto.extension} failed`,
          error,
        });
        handlePrismaErrors(error);
      }

      // checks if there is no link with the current extension, if there is then throw error
      // if no link is found, extension is unique and the rest of the method can continue
      if (link !== null) {
        logger.debug(`extension :${dto.extension} taken in updateLink`);
        throw new ForbiddenException('extension taken');
      }
    }

    // creates an object for the update operation, no extension is initialized
    const data = {
      extension: dto.extensionChanged ? dto.extension : undefined,
      target: dto.target,
      public: dto.public,
      titleTag: dto.titleTag,
      favicon,
    };

    try {
      // updates the extension and target for a certain link with link id
      logger.info(`prisma.link.update for ${id} initiated with body: ${dto}`);
      linkChange = await this.prisma.link.update({
        where: { id },
        data,
      });
    } catch (error) {
      // handles any prisma errors that come up
      logger.error({ message: `prisma.link.update for ${id} failed`, error });
      handlePrismaErrors(error);
    }

    const payload: IResponse = {
      statusCode: 200,
      message: 'Link updated',
      data: { linkChange },
    };

    logger.info({ message: `updateLink succedded for ${id}`, payload });
    return payload;
  }

  // though this is an authenticated method, we don't pass the request object
  // because we don't use anything from the account object
  // we are assuming that they are deactivating a link they own
  async deactivateLink(id: number): Promise<IResponse> {
    // creates empty linkChange object to store data
    let linkChange: any;

    try {
      // changes active to "false" for the link
      logger.info(`prisma.link.update for ${id} for deactivation initiated`);
      linkChange = await this.prisma.link.update({
        where: { id },
        data: {
          active: false,
        },
      });
    } catch (error) {
      // handles any prisma errors that come up
      logger.info({
        message: `prisma.link.update for ${id} for deactivation failed`,
        error,
      });
      handlePrismaErrors(error);
    }

    const payload: IResponse = {
      statusCode: 200,
      message: 'Link deactivated',
      data: { linkChange },
    };

    logger.info({ message: `deactivateLink for ${id} passed`, payload });
    return payload;
  }
}

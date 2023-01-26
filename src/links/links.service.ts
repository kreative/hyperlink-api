import { ForbiddenException, Injectable } from '@nestjs/common';
import { Link } from '@prisma/client';
import { customAlphabet } from 'nanoid';
import { PrismaService } from '../../src/prisma/prisma.service';
import { IResponse } from '../../types/IResponse';
import { handlePrismaErrors } from '../../utils/handlePrismaErrors';
import logger from '../../utils/logger';
import { NewLinkDto, UpdateLinkDto } from './links.dto';

@Injectable()
export class LinksService {
  constructor(private prisma: PrismaService) {}

  // creates a new, unique application id number
  async generateExtension(): Promise<string> {
    let unique: boolean = false;
    let newExt: string = '';
    let characters: string = 'abcdefghijklmnopqrstuvwxyz1234567890';
    // create new 'nanoid' function with custom parameters
    const nanoid: Function = customAlphabet(characters, 6);
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
  async createUserLink(dto: NewLinkDto): Promise<IResponse> {
    // modifying certain default values
    const ghost: boolean = false;

    const payload: IResponse = {
      statusCode: 200,
      message: 'User link created',
    };

    return payload;
  }

  // returns ALL links in the Hyperlink database
  async getLinks(): Promise<IResponse> {
    let links: Link[];

    try {
      // attempts to retrieve all links in the database
      logger.info(`prisma.links.findMany initiated`);
      links = await this.prisma.link.findMany();
    } catch (error) {
      // some sort of prisma error occured
      logger.error({ message: `prisma.links.findMany failed`, error });
      handlePrismaErrors(error);
    }

    const payload: IResponse = {
      statusCode: 200,
      message: 'Links found',
      data: { links },
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

    // here we check to see if the extension that was sent over is unique
    // since this method would also take an unchanged extension, we use extensionChanged to know when to check
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
      // and if the id of the POST request and the id (link.id) of the found link are the same then nothing happens
      // this is because that means that updating the extension will have no actual affect on the link
      // if no link is found, extension is unique and the rest of the method can continue
      if (link !== null && link.id !== id) {
        logger.debug(`extension :${dto.extension} taken in updateLink`);
        throw new ForbiddenException('extension taken');
      }
    }

    // creates an object for the update operation, no extension is initialized
    let data: any = {
      target: dto.target
    };

    // only adds a new extension if the post request body has extensionChanged === true
    if (dto.extensionChanged) {
      // adds the new extension to the update data object
      data.extension = dto.extension;
    }

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

  async deactivateLink(id: number): Promise<IResponse> {
    let linkChange: any;

    try {
      // changes active to "false"
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

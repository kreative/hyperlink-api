import { ForbiddenException, Injectable } from '@nestjs/common';
import { Link } from '@prisma/client';
import { customAlphabet } from 'nanoid';
import { PrismaService } from 'src/prisma/prisma.service';
import { IResponse } from 'types/IResponse';
import { handlePrismaErrors } from 'utils/handlePrismaErrors';
import logger from 'utils/logger';
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
      logger.error(`prisma.link.create in createGhostLink error: ${error}`);
      handlePrismaErrors(error);
    }

    const payload: IResponse = {
      statusCode: 200,
      message: 'Ghost link created',
      data: { link },
    };

    logger.info(`createGhostLink passed with payload: ${payload}`);
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
        logger.info(
          `prisma.link.findUnique for extension ${dto.extension} initiated`,
        );
        link = await this.prisma.link.findUnique({
          where: { extension: dto.extension },
        });
      } catch (error) {
        // handles any prisma errors that come up
        logger.error(
          `prisma.link.findUnique for extension ${dto.extension} error: ${error}`,
        );
        handlePrismaErrors(error);
      }

      // checks if there is no link with the current extension, if there is then throw error
      // if no link is found, extension is unique and the rest of the method can continue
      if (link !== null) {
        throw new ForbiddenException('extension taken');
      }
    }

    try {
      // updates the extension and target for a certain link with link id
      logger.info(`prisma.link.update for ${id} initiated with body: ${dto}`);
      linkChange = await this.prisma.link.update({
        where: { id },
        data: {
          extension: dto.extension,
          target: dto.target,
        },
      });
    } catch (error) {
      // handles any prisma errors that come up
      logger.error(`prisma.link.update for ${id} error: ${error}`);
      handlePrismaErrors(error);
    }

    const payload: IResponse = {
      statusCode: 200,
      message: 'Link updated',
      data: { linkChange },
    };

    logger.info(`updateLink succedded for ${id} with payload: ${payload}`);
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
          active: false
        }
      });
    } catch (error) {
      // handles any prisma errors that come up
      logger.info(`prisma.link.update for ${id} for deactivation error: ${error}`);
      handlePrismaErrors(error);
    }

    const payload: IResponse = {
      statusCode: 200,
      message: "Link deactivated",
      data: { linkChange }
    };

    logger.info(`deactivateLink for ${id} passed with payload: ${payload}`);
    return payload;
  }
}

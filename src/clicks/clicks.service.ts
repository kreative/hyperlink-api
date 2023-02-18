import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Click, Link } from '@prisma/client';
import { LinksService } from '../../src/links/links.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { IClickDataRequest } from '../../types/IClickDataRequest';
import { IResponse } from '../../types/IResponse';
import { handlePrismaErrors } from '../../utils/handlePrismaErrors';
import logger from '../../utils/logger';

@Injectable()
export class ClicksService {
  constructor(private prisma: PrismaService) {}

  @Inject(LinksService)
  private readonly links: LinksService;

  // creates a click instance, updates clickCount, and sends back link target
  async transformAndCreateClick(
    req: IClickDataRequest,
    extension: string,
  ): Promise<IResponse> {
    let link: Link;
    let click: Click;
    let linkChange: any;

    // loads ip info data from middleware
    const ipinfo = req.ipinfoData;

    try {
      // tries to find the link using the extension
      logger.info(`prisma.link.findUnique with ext: ${extension} initiated`);
      link = await this.prisma.link.findUnique({
        where: { extension },
      });
    } catch (error) {
      // hanels any prisma errors that come up
      console.log(error);
      logger.error({
        message: `prisma.link.findUnique with ext: ${extension} failed`,
        error,
      });
      handlePrismaErrors(error);
    }

    // this checks to see if a link was found or not
    // if the link is empty than we throw NotFoundError and the client side should redirect to 404 page
    // or if for some reason a deactivated link is looked up we wil return a NotFoundException
    if (link === null || !link.active) {
      logger.warn(`no active link found with ext: ${extension}`);
      throw new NotFoundException(
        `active link not found with ext: ${extension}`,
      );
    }

    // create a new entry in the clicks database using ipinfo
    try {
      logger.info({
        message: `prisma.click.create for ext: ${extension} initiated`,
        ipinfo,
      });
      click = await this.prisma.click.create({
        data: {
          ipAddress: ipinfo.ip || null,
          country: ipinfo.country || null,
          region: ipinfo.region || null,
          city: ipinfo.city || null,
          postal: ipinfo.postal || null,
          loc: ipinfo.loc || null,
          timezone: ipinfo.timezone || null,
          os: req.userAgent.os.name || null,
          browser: req.userAgent.browser.name || null,
          browserVersion: req.userAgent.browser.version || null,
          deviceType: req.userAgent.device.model || null,
          deviceVendor: req.userAgent.device.vendor || null,
          referralUrl: req.referralUrl || null,
          ua: req.userAgent.ua || null,
          cpu: req.userAgent.cpu.architecture || null,
          linkId: link.id,
        },
      });
      // should log the new click object created with prisma
      logger.debug({
        message: `new click created for ext: ${extension}`,
        click,
      });
    } catch (error) {
      // handles any prisma errors that come up, however we cannot throw errors like we do
      // with the handlePrismaErrors utility, because we still need the user to get to their target url
      // as a result, we will just log this error as 'error'
      logger.error({
        message: `prisma.click.create for ext: ${extension} failed`,
        error,
      });
    }

    // update clickCount in links object for the specified link
    try {
      logger.info(
        `prisma.link.update for clickCount for ext: ${extension} initiated`,
      );
      linkChange = await this.prisma.link.update({
        where: { id: link.id },
        data: { clickCount: link.clickCount + 1 },
      });
      // should log the new click count based on the linkChange object sent back
      logger.debug(
        `clickCount for link: ${link.id} updated to ${linkChange.clickCount}`,
      );
    } catch (error) {
      // as with the creation of the click object, we can't throw an error here
      // while this method (like the create click) shouldn't fail, we still need to make sure
      // that the target url for the user is sent back successfully
      logger.error({
        message: `prisma.link.update for clickCount failed`,
        error,
      });
    }

    // return the target url to the client side, we will not return the click object
    const payload: IResponse = {
      statusCode: 200,
      message: 'Click created and target URL found',
      data: { target: link.target },
    };

    logger.info({
      message: `transformAndCreateClick for ext: ${extension} passed`,
      payload,
    });
    return payload;
  }
}

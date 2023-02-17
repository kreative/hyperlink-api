import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { IClickDataRequest } from 'types/IClickDataRequest';
import logger from '../utils/logger';

@Injectable()
export class ReferrerMiddleware implements NestMiddleware {
  use(req: IClickDataRequest, res: Response, next: NextFunction) {
    logger.info('finding referral URL for new GET /:extension call');
    // get the referral url from the incoming request
    const referralUrl: string = req.headers.referer || '';
    // attach the data from node-ipinfo onto the response object body
    req.referralUrl = referralUrl;
    logger.info(
      `found referralUrl ${referralUrl} for new GET /:extension call`,
    );
    next();
  }
}

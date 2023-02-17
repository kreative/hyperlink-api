import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { IClickDataRequest } from 'types/IClickDataRequest';
import { IResult, UAParser, UAParserInstance } from 'ua-parser-js';
import logger from '../utils/logger';

@Injectable()
export class UserAgentMiddleware implements NestMiddleware {
  use(req: IClickDataRequest, res: Response, next: NextFunction) {
    logger.info('finding user agent for new GET /:extension call');
    // get the user agent from the incoming request
    const userAgent: string = req.headers['user-agent'] || '';
    // attach the data from node-ipinfo onto the response object body
    const parser: UAParserInstance = new UAParser(userAgent);
    const parserResults: IResult = parser.getResult();
    req.userAgent = parserResults;
    logger.info({
      message: `found userAgent info for new GET /:extension call`,
      parserResults,
    });
    next();
  }
}

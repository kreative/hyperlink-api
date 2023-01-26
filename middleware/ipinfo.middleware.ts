import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import IPinfoWrapper, { IPinfo, ApiLimitError } from 'node-ipinfo';
import * as requestIp from 'request-ip';
import { IClientIpinfoRequest } from 'types/IClientIpinfoRequest';

import logger from '../utils/logger';

const ipinfoWrapper = new IPinfoWrapper(process.env.IPINFO_TOKEN);

@Injectable()
export class IpInfoMiddlewware implements NestMiddleware {
  use(req: IClientIpinfoRequest, res: Response, next: NextFunction) {
    // get the ip address from the incoming request
    const ipAddress: string = requestIp.getClientIp(req);
    logger.info(`found ipAddress ${ipAddress} for new GET /:extension call`);

    // lookUp the ip address using node-ipinfo with correct types
    ipinfoWrapper
      .lookupIp(ipAddress)
      .then((response: IPinfo) => {
        // ipinfo api worked and there are no errors from the node library as well
        logger.debug({
          message: `ip lookup for ${ipAddress} found response`,
          response,
        });
        console.log(response);
        // attach the data from node-ipinfo onto the response object body
        req.body.ipinfoData = response as any;
      })
      .catch((error: any) => {
        // something went wrong with ipinfo's api or node library
        // since we don't want to ruin the experience of our client who wants to get to their link
        // we will not throw any errors if the ip info lookup doesn't work, the user will still get
        // a positive response... if no data comes from this middleware, null will be provided in the database
        if (error instanceof ApiLimitError) {
          // this error will happen if we exceed our limit for API usage, shouldn't happen often
          logger.fatal({
            message: `ip lookup for ${ipAddress} failed with ApiLimitError`,
            error,
          });
        } else {
          // this is any sort of other unknown error
          logger.fatal({
            message: `ip lookup for ${ipAddress} failed with unknown error`,
            error,
          });
        }
      })
      .finally(() => {
        // we want to make sure that next() is called in the finally block
        // regardless of how the ip info look up goes, the controller needs to send back the target url
        next();
      });
  }
}

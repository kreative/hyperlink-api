import { Request } from 'express';

export interface IClickDataRequest extends Request {
  // adds the custom object of 'ipinfoData' to standard express Request interface
  ipinfoData?: any;
  // adds custom user agent data to express request
  userAgent?: any;
  // adds the referral url string to express request
  referralUrl?: string;
}

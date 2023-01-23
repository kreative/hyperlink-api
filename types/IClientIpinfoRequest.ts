import { Request } from 'express';

export interface IClientIpinfoRequest extends Request {
  // adds the custom object of 'ipinfoData' to standard express Request interface
  ipinfoData: any;
}

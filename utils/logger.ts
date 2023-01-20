import * as logdna from "@logdna/logger";

const options: any = {
  app: 'kreative-hyperlink-api',
  level: 'debug'
};

const logger = logdna.createLogger(process.env.MEZMO_KEY, options);

export default logger;
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AppController } from './app.controller';

import { SentryModule } from './sentry/sentry.module';
import { ClicksModule } from './clicks/clicks.module';
import { LinksModule } from './links/links.module';
import * as Sentry from '@sentry/node';
import '@sentry/tracing';
import { IpInfoMiddlewware } from '../middleware/ipinfo.middleware';
import { ClicksController } from './clicks/clicks.controller';
import { AuthenticateMiddleware } from 'middleware/authenticate';
import { LinksController } from './links/links.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SentryModule.forRoot({
      dsn: process.env.SENTRY_DNS,
      tracesSampleRate: 1.0,
      debug: true,
    }),
    PrismaModule,
    ClicksModule,
    LinksModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    // sentry specific middlware
    consumer.apply(Sentry.Handlers.requestHandler()).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });

    // adds middleware for getting data based on ip info for Clicks controller
    consumer.apply(IpInfoMiddlewware).forRoutes(ClicksController);

    // adds authentication middleware for routes that user's access
    // the only path that get's exclude is creating a ghost link, all other paths need a user
    consumer
      .apply(AuthenticateMiddleware)
      .exclude({ path: 'v1/links/ghost', method: RequestMethod.POST })
      .forRoutes(LinksController);
  }
}

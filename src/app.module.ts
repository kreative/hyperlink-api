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
import { ReferrerMiddleware } from '../middleware/referrer.middleware';
import { UserAgentMiddleware } from '../middleware/useragent.middleware';

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
    if (process.env.ENVIRONMENT !== 'development') {
      consumer.apply(Sentry.Handlers.requestHandler()).forRoutes({
        path: '*',
        method: RequestMethod.ALL,
      });
    }
    consumer.apply(IpInfoMiddlewware).forRoutes(ClicksController);
    consumer.apply(ReferrerMiddleware).forRoutes(ClicksController);
    consumer.apply(UserAgentMiddleware).forRoutes(ClicksController);
  }
}

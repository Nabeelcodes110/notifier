import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { SiteModule } from './site/site.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { Site } from './site/entities/site.entity';
import { ConfigModule } from '@nestjs/config';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { NestApplication } from '@nestjs/core';
import { authMiddleware } from './middleware/auth.middleware';
import { MailerModule } from '@nestjs-modules/mailer';
import { BullModule } from '@nestjs/bull';
import { ScheduleModule } from '@nestjs/schedule';
import { SchedulerModule } from './scheduler/scheduler.module';
import { InspectionConsumer } from './scheduler/queue.consumer';
import Bull from 'bull';
import { mailerQueueConsumer } from './site/mailerQueue.consumer';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      password: process.env.DATABASE_PASSWORD,
      username: process.env.DATABASE_USERNAME,
      entities: [User, Site],
      database: 'task1',
      synchronize: true,
      logging: true,
    }),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: String(process.env.USER),
          pass: String(process.env.USER_PASS),
        },
      },
    }),
    BullModule.forRoot({
      redis : {
        host : 'localhost',
        port : 6379
      } 
    }),
    ScheduleModule.forRoot(),
    SchedulerModule,
    UserModule,
    SiteModule,
  ],
  controllers: [AppController],
  providers: [AppService, InspectionConsumer , mailerQueueConsumer],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(authMiddleware).forRoutes('site');
  }
}

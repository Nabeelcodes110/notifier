import { Module } from '@nestjs/common';
import { SiteService } from './site.service';
import { SiteController } from './site.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Site } from './entities/site.entity';
import { UserModule } from 'src/user/user.module';
import { User } from 'src/user/entities/user.entity';
import { mailerQueueConsumer } from './mailerQueue.consumer';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [TypeOrmModule.forFeature([Site, User]),
  BullModule.registerQueue({
    name: 'mailerQueue'
  }),
],
  controllers: [SiteController],
  providers: [SiteService],
  exports : [SiteService]
})
export class SiteModule {}

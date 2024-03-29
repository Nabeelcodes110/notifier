import { Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bull';
import { InspectionService } from './queue.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Site } from 'src/site/entities/site.entity';
import { SiteModule } from 'src/site/site.module';
// import { SiteService } from 'src/site/site.service';

@Module({
    imports : [
        TypeOrmModule.forFeature([Site]),
        BullModule.forRoot({
            redis : {
              host : 'localhost',
              port : 6379
            } 
          }),
        BullModule.registerQueue({
            name : 'inspectionQueue'
        }),
        SiteModule
    ],
    providers : [SchedulerService, InspectionService],
    exports : [SchedulerService, InspectionService]
})
export class SchedulerModule {}

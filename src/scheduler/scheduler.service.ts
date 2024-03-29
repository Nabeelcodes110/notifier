import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { QueueScheduler } from 'rxjs/internal/scheduler/QueueScheduler';
import { InspectionService } from './queue.service';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class SchedulerService {
  constructor(private readonly queueService : InspectionService, @InjectQueue('inspectionQueue') private inspectionQueue: Queue){}
  private readonly logger = new Logger(SchedulerService.name);
  @Cron('*/10 * * * * *')
  async handleCron() {
    this.logger.debug('Called every 5 seconds');
    this.queueService.addJobs()
  }
}
import { Processor, Process, OnQueueActive } from '@nestjs/bull';
import { Inject } from '@nestjs/common';
import { Job } from 'bull';
import { SiteService } from 'src/site/site.service';

@Processor('inspectionQueue')
export class InspectionConsumer {
  constructor(private readonly siteService: SiteService) {}

  @OnQueueActive()
  onActive(job: Job) {
    console.log(
      `Processing job ${job.id} of type ${job.name} with data ${job.data}...`,
    );
  }

  @Process('check')
  async worker(job: Job<unknown>) {
    try{
      const counts = await this.siteService.queueCheck(job);
      return {};
    }catch(error){
        throw error;
    }
  }
}

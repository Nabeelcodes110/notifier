import { Processor, Process, OnQueueActive} from '@nestjs/bull';
import { Inject } from '@nestjs/common';
import { Job } from 'bull';
import { SiteService } from 'src/site/site.service';

@Processor('inspectionQueue')
export class InspectionConsumer {
    constructor(private readonly siteService : SiteService){}

    @OnQueueActive()
    onActive(job: Job) {
        console.log(
        `Processing job ${job.id} of type ${job.name} with data ${job.data}...`,
        );
    }
    
    @Process('job')
    async worker(job: Job<unknown>) {
        //TODO : Check website, inform user and update the last checked time
        console.log("Check website and update")
        

        return {};
    }
}
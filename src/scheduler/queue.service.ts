import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { InjectRepository } from '@nestjs/typeorm';
import { Site } from 'src/site/entities/site.entity';
import { Repository } from 'typeorm';

@Injectable()
export class InspectionService {
  constructor(@InjectQueue('inspectionQueue') private inspectionQueue: Queue,
  @InjectRepository(Site) private readonly siteRepository : Repository<Site>) {}

  async addJobs() : Promise<void>{
    console.log("Adding jobs")
    const jobs = await this.siteRepository.find()
    const count = await this.inspectionQueue.count()
    console.log(count)
    const job = await this.inspectionQueue.add('job',{
        jobs
      });
    }
}
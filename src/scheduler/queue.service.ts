import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { InjectRepository } from '@nestjs/typeorm';
import { Site } from 'src/site/entities/site.entity';
import { Repository } from 'typeorm';

@Injectable()
export class InspectionService {
  constructor(
    @InjectQueue('inspectionQueue') private inspectionQueue: Queue,
    @InjectRepository(Site) private readonly siteRepository: Repository<Site>,
  ) {}

  async addJobs(): Promise<number> {
    console.log('Adding jobs');
    const sitesCount = await this.siteRepository.count();
    const LIMIT = 1000;

    for (let index = 0; index < sitesCount; index += LIMIT) {
      const job = await this.inspectionQueue.add('check', {
        start: index,
        end : Math.min(sitesCount , index + LIMIT),
      });
    }
    return sitesCount;
  }
}

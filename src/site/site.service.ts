import { Injectable } from '@nestjs/common';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Site } from './entities/site.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class SiteService {
  constructor(@InjectRepository(Site) private readonly siteRepository : Repository<Site> , @InjectRepository(User) private readonly userRepository : Repository<User>){}
  async create(createSiteDto: CreateSiteDto , req : Request) {
    const {id} = req.body['user']
    const site = new Site()
    site.name = createSiteDto.name;
    site.url = createSiteDto.url;
    const user = await this.userRepository.findOneBy(id)    
    site.owner = user
    return this.siteRepository.save(site);
  }

  findAll() {
    return this.siteRepository.find();
  }

  findOne(id: number) {
    return this.siteRepository.findOneBy({id});
  }

  async update(id: number, updateSiteDto: UpdateSiteDto) {
    const site = await this.siteRepository.findOneBy({id})
    site.id = id
    site.name = updateSiteDto.name;
    site.url = updateSiteDto.url
    return this.siteRepository.save(site);
  }

  remove(id: number) {
    return this.siteRepository.delete(id);
  }
}

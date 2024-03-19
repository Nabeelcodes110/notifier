import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Site } from './entities/site.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import axios from 'axios'

@Injectable()
export class SiteService {

  constructor(@InjectRepository(Site) private readonly siteRepository : Repository<Site> , @InjectRepository(User) private readonly userRepository : Repository<User>){}
  
  async create(createSiteDto: CreateSiteDto , req : Request) : Promise<Site> {
    const {id} = req.body['user']
    const { name , url } = createSiteDto

    const isValid = await this.checkWebsite(url)
    console.log(isValid)

    if(!isValid) throw new BadRequestException('Invalid URL' , 'Input URL is not working')

    const site = new Site()
    site.name = name;
    site.url = url;
    const user = await this.userRepository.findOneBy(id)    
    site.owner = user
    return this.siteRepository.save(site);
  }

  async checkWebsite(url: string): Promise<boolean> {
    try {
      const response = await axios.head(url);
      return response.status === 200;
    } catch (error) {
      console.error('Error checking website:', error);
      return false;
    }
  }

  findAll() :Promise<Site[]>{
    return this.siteRepository.find();
  }

  findOne(id: number) :Promise<Site> {
    return this.siteRepository.findOneBy({id});
  }

  async update(id: number, updateSiteDto: UpdateSiteDto) : Promise<Site>{
    const site = await this.siteRepository.findOneBy({id})
    site.id = id
    site.name = updateSiteDto.name;
    site.url = updateSiteDto.url
    return this.siteRepository.save(site);
  }

  remove(id: number){
    return this.siteRepository.delete(id);
  }
}

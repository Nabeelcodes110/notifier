import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Site } from './entities/site.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { MailerService } from '@nestjs-modules/mailer';
import axios from 'axios';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
@Injectable()
export class SiteService {
  constructor(
    @InjectRepository(Site) private readonly siteRepository: Repository<Site>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectQueue('mailerQueue') private mailerQueue : Queue,
    private mailerService : MailerService,

  ) {}

  //function to create new website entry
  async create(createSiteDto: CreateSiteDto, req: Request): Promise<Site> {
    try{
      const { sub : id} = req.body['user'];
      const { name, url } = createSiteDto;
    
      //creating a new site
      const site = new Site();
      site.name = name;
      site.url = url;
      
      //finding a user with a given userid
      const user = await this.userRepository.findOneBy({id});
      site.owner = user;
      
      const isValid = await this.checkWebsite(site);
      console.log(isValid);
      if (!isValid)
        throw new BadRequestException('Invalid URL', 'Input URL is not working');

      return this.siteRepository.save(site);
    }
    catch(err){
      throw new Error(err)
    }
  }

  //function to check whether site is up or not
  async checkWebsite(site : Site): Promise<Site> {
    try {
      const response = await axios.head(site.url);
      if (response.status === 200) return site
    } catch (error) {
      console.error('Error checking website:', error);
      return site
    }
  }

  //returns all site
  findAll(): Promise<Site[]> {
    return this.siteRepository.createQueryBuilder('site').leftJoinAndSelect('site.owner' , 'user')
      .select(['site' , 'user.id']).getMany()
    // return this.siteRepository.find();
  }

  //retruns a site with  given id
  findOne(id: number): Promise<Site> {
    return this.siteRepository.findOneBy({ id });
  }

  //updates the site with given id
  async update(id: number, updateSiteDto: UpdateSiteDto): Promise<Site> {
    try{

      const site = await this.siteRepository.findOneBy({ id });
      site.id = id;
      site.name = updateSiteDto.name;
      site.url = updateSiteDto.url;
      return this.siteRepository.save(site);
    }
    catch(err){
      throw new Error("Site is down")
    }
  }

  //deletes the site with given id
  remove(id: number) {
    return this.siteRepository.delete(id);
  }


  /*function to check the batch of sites
  if up and working then updates the last checked time
  else sends mail to the owner and updates the last failure time */
  async queueCheck(job) {
    try{
      const {start, end} = job.data

      // find sites based on start end
      const sites = await this.siteRepository.createQueryBuilder('site').leftJoinAndSelect('site.owner' , 'user')
      .select(['site' , 'user.id']).skip(start).limit(end-start).getMany()



      if(!sites){
        // throw error
        throw new Error('No data Found')
      }

      const promises = sites.map(site=>{
        return this.checkWebsite(site)
      });

      const results = await Promise.allSettled(promises);

      const successPromises = []
      const rejectedPromises = []

      for(let res of results){
        if(res.status === 'fulfilled') successPromises.push(res)
        else rejectedPromises.push(res)
      }

      // handle succes
      await Promise.all(successPromises.map(async (successPromise)=>{
        successPromise.value.updatedAt = new Date()
        await this.siteRepository.save(successPromise.value)

      }))

      
      // error failure
      await Promise.all(rejectedPromises.map(async (rejectedPromise)=>{
        //add job to send mail to respective user
        // this.mailerQueue.add('mail' , {
        //   payload : JSON.stringify(rejectedPromise.reason)
        // })
        
        //update the last failure time
        rejectedPromise.reason.lastFailure = new Date()
        await this.siteRepository.save(rejectedPromise.reason)

      }))
    }catch(error){
      throw new Error(error)
    }
  }
}

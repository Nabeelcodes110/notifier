import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseInterceptors } from '@nestjs/common';
import { SiteService } from './site.service';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';
import { siteValidator } from './siteValidator.interceptor';
import { Site } from './entities/site.entity';

@Controller('site')
export class SiteController {
  constructor(private readonly siteService: SiteService) {}

  // @UseInterceptors(siteValidator)
  @Post()
  create(@Body() createSiteDto: CreateSiteDto ,@Req() req : Request):Promise<Site>  {
    return this.siteService.create(createSiteDto ,req);
  }

  @Get()
  findAll() : Promise<Site[]>{
    return this.siteService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) : Promise<Site> {
    return this.siteService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSiteDto: UpdateSiteDto) : Promise<Site>{
    return this.siteService.update(+id, updateSiteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.siteService.remove(+id);
  }
}

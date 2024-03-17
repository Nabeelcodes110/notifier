import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseInterceptors } from '@nestjs/common';
import { SiteService } from './site.service';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';
import { siteValidator } from './siteValidator.interceptor';

@Controller('site')
export class SiteController {
  constructor(private readonly siteService: SiteService) {}

  @UseInterceptors(siteValidator)
  @Post()
  create(@Body() createSiteDto: CreateSiteDto ,@Req() req : Request) {
    return this.siteService.create(createSiteDto ,req);
  }

  @Get()
  findAll() {
    return this.siteService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.siteService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSiteDto: UpdateSiteDto) {
    return this.siteService.update(+id, updateSiteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.siteService.remove(+id);
  }
}

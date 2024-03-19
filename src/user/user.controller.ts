import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from './entities/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  signup(@Body() createUserDto: CreateUserDto,@Req() req, @Res() res) : Promise<User> {
    return this.userService.signup(createUserDto , req, res);
  }

  @Post('login')
  login(@Body() loginUserDto : LoginUserDto, @Req() req, @Res() res) : Promise<User>{
    return this.userService.login(loginUserDto, req, res);
  }


  @UseGuards(AuthGuard('magiclogin'))
  @Get('login/callback')
  callback(@Req() req) : Promise<User>{
    console.log(req.user)
    return this.userService.verifyUser(req);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findById(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto : UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}

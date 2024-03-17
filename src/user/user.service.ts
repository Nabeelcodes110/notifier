import { Inject, Injectable, Req, Res, UnauthorizedException, forwardRef } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { MagicLinkStrategy } from './magicLink.service';
// import MagicLoginStrategy from 'passport-magic-login';

const salt = 10

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly userRepository : Repository<User>, private jwtService : JwtService,
  @Inject(forwardRef(() => MagicLinkStrategy))private readonly strategy : MagicLinkStrategy){}

  findUserByEmail(email : string){
    const user = this.userRepository.findOneBy({email})
    if(!user){
      throw new UnauthorizedException()
    }
    return user
  }

  async signup(createUserDto: CreateUserDto, @Req() req, @Res() res) {
    const user = new User()
    user.email = createUserDto.email;
    user.username = createUserDto.username;
    const hashPassword = await bcrypt.hash(createUserDto.password , salt)
    user.password = hashPassword;

    //TODO: Send the email
    this.strategy.send(req,res);

    return this.userRepository.save(user);
  }

  async login(loginUserDto: LoginUserDto) {
    const {email , password : pass} = loginUserDto
    const user = await this.findUserByEmail(email);

    if(user.isVerified){
      //TODO : Send mail
      throw new UnauthorizedException('NOT VERIFIED' , 'Please verify your account first');
    }

    const isMatch = await bcrypt.compare(user.password , pass)
    if(isMatch){
      throw new UnauthorizedException();
    }

    const {password , ...result} = user

    const payload = {sub : user.id , username : user.username}

    return {
      access_token : await this.jwtService.signAsync(payload)
    }
  }

  findAll() {
    return `This action returns all user`;
  }

  async findById(id: number) {
    return await this.userRepository.findOneBy({id});
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}

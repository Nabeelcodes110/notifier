import { BadRequestException, Inject, Injectable, Req, Res, UnauthorizedException, forwardRef , Response } from '@nestjs/common';
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

  async findUserByEmail(email : string) : Promise<User>{
    const user = await this.userRepository.findOneBy({email})
    return user
  }

  async signup(createUserDto: CreateUserDto, @Req() req, @Res() res) : Promise<User>{
    const email = createUserDto.email
    const exist = await this.findUserByEmail(email)
    console.log(`user exist? ${exist}`)
    if(exist?.id){
      throw new BadRequestException("UserExist", "ALready signedup")
    }
    const user = new User()
    user.email = createUserDto.email;
    user.username = createUserDto.username;
    const hashPassword = await bcrypt.hash(createUserDto.password , salt)
    user.password = hashPassword;
    await this.userRepository.save(user);

    console.log("User saved and link is sent")

    this.strategy.send(req,res);


    return user
  }

  async login(loginUserDto: LoginUserDto, @Req() req, @Res() res) : Promise<any> {

    const {email , password : pass} = loginUserDto
    const user = await this.findUserByEmail(email);

    if(!user){
      throw new UnauthorizedException("UserNotSignedUp" , "First Signup please")
    }

    if(!user?.isVerified){
      //TODO : Send mail
      this.strategy.send(req , res)
      throw new UnauthorizedException('NOT VERIFIED' , 'Please verify your account first');
    }
    const isMatch = await bcrypt.compare(user.password , pass)
    console.log(isMatch)
    if(isMatch){
      throw new UnauthorizedException();
    }

    const {password , ...result} = user

    const payload = {sub : user.id , username : user.username}

    const access_token = this.jwtService.sign(payload)
    console.log(access_token)
    return res.json({
      access_token
    })
  }

  async verifyUser(@Req() req) : Promise<User>{
    const id = req.user?.id
    const newUser =  await this.userRepository.findOneBy({id})
    newUser.id = req.user.id
    newUser.isVerified = true;
    return this.userRepository.save(newUser)
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

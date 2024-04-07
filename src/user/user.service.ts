import {
  BadRequestException,
  Inject,
  Injectable,
  Req,
  Res,
  UnauthorizedException,
  forwardRef,
  Response,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { MagicLinkStrategy } from './magicLink.service';
const salt = 10;

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
    @Inject(forwardRef(() => MagicLinkStrategy))
    private readonly strategy: MagicLinkStrategy,
  ) {}

  async findUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ email });
    return user;
  }

  /*create new user in the DB
  and sends email for verification */
  async signup(
    createUserDto: CreateUserDto,
    @Req() req,
    @Res() res,
  ): Promise<User> {
    try {
      const email = createUserDto.email;
      // checking if user exist
      const exist = await this.findUserByEmail(email);
      if (exist?.id) {
        throw new BadRequestException('UserExist', 'Already signedup');
      }
      // create user
      const user = new User();
      user.email = email;
      user.username = createUserDto.username;
      const hashPassword = await bcrypt.hash(createUserDto.password, salt);
      user.password = hashPassword;
      await this.userRepository.save(user);

      console.log('User saved and link is sent');

      this.strategy.send(req, res);

      return user;
    } catch (error) {
      throw new Error(error);
    }
  }

  /*checks whether user exist or not
  then checks if user is verified or not
  if not verified then send the email for verification */
  async login(
    loginUserDto: LoginUserDto,
    @Req() req,
    @Res() res,
  ): Promise<any> {
    try{

      const { email, password: pass } = loginUserDto;
      const user = await this.findUserByEmail(email);

      if (!user) {
      throw new UnauthorizedException('UserNotSignedUp', 'First Signup please');
    }

    if (!user?.isVerified) {
      //TODO : Send mail
      this.strategy.send(req, res);
      throw new UnauthorizedException(
        'NOT VERIFIED',
        'Please verify your account first',
        );
      }
      const isMatch = await bcrypt.compare(user.password, pass);
      console.log(isMatch);
      if (isMatch) {
        throw new UnauthorizedException();
      }
      
      const { password, ...result } = user;
      
      const payload = { sub: user.id, username: user.username };
      
      const access_token = this.jwtService.sign(payload);
      console.log(access_token);
      return res.json({
        access_token,
      });
    }
    catch(err){
      throw new Error(err)
    }
  }

  /*
  this function gets executed after email verification link is clicked
  and the user is marked as verified
  */
  async verifyUser(@Req() req): Promise<User> {
    try{

      const id = req.user?.id;
      const newUser = await this.userRepository.findOneBy({ id });
      newUser.id = req.user.id;
      newUser.isVerified = true;
      return this.userRepository.save(newUser);
    }
    catch(err){
      throw new Error(err)
    }
  }

  findAll() {
    return `This action returns all user`;
  }

  async findById(id: number) :Promise<User> {
    return await this.userRepository.findOneBy({ id });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}

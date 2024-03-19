import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import {
    IsAlphanumeric,
    IsEmail,
    IsNotEmpty,
    IsString,
    MinLength,
  } from 'class-validator';

export class LoginUserDto{
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email : string;

    @IsEmail()
    destination : string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8 , {message : 'password length must be atleast 8 characters.'})
    password : string;
}

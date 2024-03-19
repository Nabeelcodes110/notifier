import {
    IsAlphanumeric,
    IsEmail,
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsString,
    Matches,
    MaxLength,
    MinLength,
  } from 'class-validator';


export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3 , {message : 'name must have atleast 2 characters.'})
    username : string;

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

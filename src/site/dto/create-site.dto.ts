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

export class CreateSiteDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'name must have atleast 2 characters.' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  url: string;
}

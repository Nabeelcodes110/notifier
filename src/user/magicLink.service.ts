import { Inject, Injectable, UnauthorizedException, forwardRef } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import Strategy from 'passport-magic-login'
import { jwtConstants } from "config/jwtConstant";
import { UserService } from "../user/user.service";
import { User } from "../user/entities/user.entity";
import { MailerService } from "@nestjs-modules/mailer";

@Injectable()
export class MagicLinkStrategy extends PassportStrategy(Strategy){
    constructor(@Inject(forwardRef(() => UserService)) private userService: UserService, private mailService : MailerService){
        super({
            secret : jwtConstants.secret,
            jwtOptions : {
                expiresIn : '5m',
            },
            callbackUrl : 'http://localhost:3000/user/login/callback',
            sendMagicLink : async (destination , href) => {
                console.log(href)
                mailService.sendMail({
                    to : destination,
                    from : 'parvenabeel@gmail.com',
                    subject : "Account verification",
                    text : `click on th link to verify your account - ${href}`
                })
            },
            verify : async (payload , callback)=>{
                callback(null , this.validate(payload))
            }
        });
    }

    validate(payload : { destination : string}) : Promise<User>{
        const user = this.userService.findUserByEmail(payload.destination);
        if(!user){
            throw new UnauthorizedException()
        }
        return user;

    }
}
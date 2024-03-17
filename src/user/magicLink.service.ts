import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import Strategy from 'passport-magic-login'
import { jwtConstants } from "config/jwtConstant";
import { UserService } from "../user/user.service";
import { User } from "../user/entities/user.entity";

@Injectable()
export class MagicLinkStrategy extends PassportStrategy(Strategy){
    constructor(@Inject(forwardRef(() => UserService)) private userService: UserService){
        super({
            secret : jwtConstants.secret,
            jwtOptions : {
                expiresIn : '5m',
            },
            callbackUrl : 'http://localhost:3000/user/login/callback',
            sendMagicLink : async (destination , href) => {
                console.log(`sending email to ${destination} with link ${href}`)
            },
            verify : async (payload , callback)=>{
                callback(null , this.validate(payload))
            }
        });
    }

    validate(payload : { destination : string}){
        const user = this.userService.findUserByEmail(payload.destination);

    }
}
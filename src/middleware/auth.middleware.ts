import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { jwtConstants } from '../../config/jwtConstant'
import {JwtService} from '@nestjs/jwt'

@Injectable()
export class authMiddleware implements NestMiddleware {

    constructor(private jwtService : JwtService){}
    async use(req: Request, res: Response, next: NextFunction) {
        const  token = req.headers.authorization

        if(!token) throw new UnauthorizedException()
        try{
            const payload  = await this.jwtService.verifyAsync(String(token) , {
                secret : jwtConstants.secret
            })

            req.body['user'] = payload

        }catch(e){
            throw new UnauthorizedException(e)
        }
        


        next();
    }
}

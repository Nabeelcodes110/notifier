import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpException, BadRequestException} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import * as parseUrl from 'url-parse';

@Injectable()
export class siteValidator implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { url } = req.body;
    
    const resp = fetch(url).then((data)=>{
      if(!data.ok){
        throw new BadRequestException('Invalid URL', 'Invalid URL entered')
      }
    }).catch((err)=>{
      throw new BadRequestException('Invalid URL', err)
    })

    console.log('checked')

    return next
      .handle()
      .pipe(
        tap(() => {
            console.log("Successfully added new site")
        }),
      );
  }
}
import { MailerService } from "@nestjs-modules/mailer";
import { OnQueueActive, Process, Processor } from "@nestjs/bull";
import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Job } from "bull";
import { privateDecrypt } from "crypto";
import { User } from "src/user/entities/user.entity";
import { UserService } from "src/user/user.service";
import { Repository } from "typeorm";

@Processor('mailerQueue')
export class mailerQueueConsumer {
    constructor(private userService : UserService,private mailerService : MailerService){}

    @OnQueueActive()
    onActive(job: Job) {
      console.log(job.data)
    }
  
    @Process('mail')
    async sendMail(job : Job){
        const payload = job.data 
        const user = await this.userService.findById(payload.owner.id)
        this.mailerService.sendMail({
          to: user.email,
          from: 'parvenabeel@gmail.com',
          subject: 'Site Alert',
          text: `Site is down`,
        })

    }

    
}
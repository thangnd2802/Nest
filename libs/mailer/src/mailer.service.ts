import { Injectable } from '@nestjs/common';
import { MailerService as NestMailService } from '@nestjs-modules/mailer';
import { SendMailDto } from './dto/send-mail.dto';

@Injectable()
export class MailerService {
  constructor(private readonly mailService: NestMailService) {}
  async sendMail(sendMailDto: SendMailDto) {
    await this.mailService.sendMail({
      to: sendMailDto.to,
      subject: sendMailDto.subject,
      template: sendMailDto.template,
      context: sendMailDto.context,
    });
  }
}

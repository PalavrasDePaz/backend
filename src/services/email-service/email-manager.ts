import { INFO_EMAIL, INFO_EMAIL_PASSWORD } from '@src/config/server';
import { SendEmailError } from '@src/domain/errors/send-email';
import { IEmailManager } from '@src/domain/interfaces/repositories/email-manager';
import { provideSingleton } from '@src/helpers/provide-singleton';
import nodemailer from 'nodemailer';
import { SendEmailData } from './types/send-email-data';

@provideSingleton(EmailManager)
export class EmailManager implements IEmailManager {
  transporter: nodemailer.Transporter;

  constructor(auth_user = INFO_EMAIL, auth_pass = INFO_EMAIL_PASSWORD) {
    this.transporter = nodemailer.createTransport({
      host: 'smtpi.kinghost.net',
      port: 465,
      secure: true,
      auth: {
        user: auth_user,
        pass: auth_pass
      }
    });
  }

  async sendEmail(sendEmailData: SendEmailData): Promise<void> {
    try {
      await new Promise((resolve, reject) => {
        this.transporter.sendMail(
          {
            from: sendEmailData.sender,
            to: sendEmailData.receiver,
            subject: sendEmailData.subject,
            html: sendEmailData.body,
            attachments: sendEmailData.attachments
          },
          (err, info) => {
            if (err) {
              reject(err);
            } else {
              resolve(info);
            }
          }
        );
      });
    } catch (error) {
      throw new SendEmailError({
        name: 'COULD_NOT_SEND_EMAIL_ERROR',
        message: `Could not send email to ${sendEmailData.receiver}`,
        details: error
      });
    }
  }
}

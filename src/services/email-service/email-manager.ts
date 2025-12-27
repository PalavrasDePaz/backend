import {
  HELPDESK_EMAIL,
  HELPDESK_EMAIL_PASSWORD,
  HELPDESK_EMAIL_USER,
  INFO_EMAIL,
  INFO_EMAIL_PASSWORD,
  INFO_EMAIL_USER,
  SMTP_PASS,
  SMTP_PORT,
  SMTP_SERVER,
  SMTP_USER
} from '@src/config/server';
import { SendEmailError } from '@src/domain/errors/send-email';
import { IEmailManager } from '@src/domain/interfaces/repositories/email-manager';
import { provideSingleton } from '@src/helpers/provide-singleton';
import nodemailer from 'nodemailer';
import { SendEmailData } from './types/send-email-data';

@provideSingleton(EmailManager)
export class EmailManager implements IEmailManager {
  infoTransporter: nodemailer.Transporter = nodemailer.createTransport({
    host: SMTP_SERVER,
    port: SMTP_PORT,
    secure: false,
    auth: {
      user: INFO_EMAIL_USER,
      pass: INFO_EMAIL_PASSWORD
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  helpdeskTransporter: nodemailer.Transporter = nodemailer.createTransport({
    host: SMTP_SERVER,
    port: SMTP_PORT,
    secure: false,
    auth: {
      user: HELPDESK_EMAIL_USER,
      pass: HELPDESK_EMAIL_PASSWORD
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  defaultTransporter: nodemailer.Transporter = nodemailer.createTransport({
    host: SMTP_SERVER,
    port: SMTP_PORT,
    secure: false,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  async sendEmail(sendEmailData: SendEmailData): Promise<void> {
    try {
      let transporter = this.defaultTransporter;

      switch (sendEmailData.sender) {
        case INFO_EMAIL:
          transporter = this.infoTransporter;
          break;
        case HELPDESK_EMAIL:
          transporter = this.helpdeskTransporter;
          break;
        default:
          break;
      }

      await new Promise((resolve, reject) => {
        transporter.sendMail(
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

import { INFO_EMAIL_PASSWORD, INFO_EMAIL } from '@src/config/server';
import { SendEmailError } from '@src/domain/errors/send-email';
import nodemailer from 'nodemailer';
import { SupportEmailSendData } from './types/support-email-send-data';

export const sendEmailToSupport = async (
  supportEmailSendData: SupportEmailSendData,
  supportEmail: string
) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtpi.kinghost.net',
      port: 465,
      secure: true,
      auth: {
        user: INFO_EMAIL,
        pass: INFO_EMAIL_PASSWORD
      }
    });

    const info = await new Promise((resolve, reject) => {
      transporter.sendMail(
        {
          from: supportEmailSendData.email,
          to: supportEmail,
          subject: supportEmailSendData.subject,
          html: `<p> Enviado por ${supportEmailSendData.name} </p> <p> Mensagem: ${supportEmailSendData.message} </p>`
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
    console.log(info);
  } catch (error) {
    throw new SendEmailError({
      name: 'COULD_NOT_SEND_EMAIL_ERROR',
      message: `Could not send email to ${supportEmail}`,
      details: error
    });
  }
};

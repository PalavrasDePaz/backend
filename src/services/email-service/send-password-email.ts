import {
  RESET_PASSWORD_FRONTEND_HOST,
  RESET_PASSWORD_FRONTED_ROUTE,
  INFO_EMAIL_PASSWORD,
  INFO_EMAIL
} from '@src/config/server';
import { SendEmailError } from '@src/domain/errors/send-email';
import { encrypt } from '@src/helpers/message-encryption';
import nodemailer from 'nodemailer';
import { urlJoin } from 'url-join-ts';

export const sendEmailToVolunteer = async (email: string) => {
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

    const emailHash = encrypt(email);
    const resetPasswordPath = urlJoin(
      RESET_PASSWORD_FRONTEND_HOST,
      RESET_PASSWORD_FRONTED_ROUTE,
      emailHash
    );

    await new Promise((resolve, reject) => {
      transporter.sendMail(
        {
          from: INFO_EMAIL,
          to: email,
          subject: 'Cadastro Senha Palavra da Paz',
          html: `<p>Olá! Esse email foi enviado para criar sua nova senha no sistema do Palavraz de Paz, por favor utilize esse link: ${resetPasswordPath}<p>`
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
      message: `Could not send email to ${email}`,
      details: error
    });
  }
};

import {
  CREATE_PASSWORD_HOST,
  CREATE_PASSWORD_ROUTE,
  EMAIL_APP_PASSWORD,
  EMAIL_SENDER
} from '@src/config/server';
import { SendEmailError } from '@src/domain/errors/send-email';
import { encrypt } from '@src/helpers/message-encryption';
import nodemailer from 'nodemailer';
import { urlJoin } from 'url-join-ts';

export const sendEmailToVolunteer = async (email: string) => {
  console.log('Entered send email function');

  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.kinghost.net',
      port: 587,
      secure: false,
      auth: {
        user: EMAIL_SENDER,
        pass: EMAIL_APP_PASSWORD
      }
    });

    transporter.verify(function (error, _success) {
      if (error) {
        console.log(error);
      } else {
        console.log('Server is ready to take our messages');
      }
    });

    console.log('Created transporter smtp');

    const emailHash = encrypt(email);
    const resetPasswordPath = urlJoin(
      CREATE_PASSWORD_HOST,
      CREATE_PASSWORD_ROUTE,
      emailHash
    );

    console.log('Sending message to email');

    await new Promise((resolve, reject) => {
      transporter.sendMail(
        {
          from: EMAIL_SENDER,
          to: email,
          subject: 'Cadastro Senha Palavra da Paz',
          html: `<p>Olá! Esse email foi enviado para criar sua nova senha no sistema do Palavraz de Paz, por favor utilize esse link: ${resetPasswordPath}<p>`
        },
        (err, info) => {
          if (err) {
            console.error(err);
            reject(err);
          } else {
            console.log(info);
            resolve(info);
          }
        }
      );
      console.log('Email sent in promise');
    });
    console.log('Out of the email promise');
  } catch (error) {
    throw new SendEmailError({
      name: 'COULD_NOT_SEND_EMAIL_ERROR',
      message: `Could not send email to ${email}`,
      details: error
    });
  }
};

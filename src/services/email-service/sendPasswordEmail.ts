import {
  CREATE_PASSWORD_HOST,
  CREATE_PASSWORD_ROUTE,
  EMAIL_APP_PASSWORD,
  EMAIL_SENDER
} from '@src/config/server';
import { encrypt } from '@src/helpers/message-encryption';
import nodemailer from 'nodemailer';
import { join } from 'path';

export const sendEmailToVolunteer = async (email: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: EMAIL_SENDER,
      pass: EMAIL_APP_PASSWORD
    }
  });

  const emailHash = encrypt(email);
  const resetPasswordPath = join(
    CREATE_PASSWORD_HOST,
    CREATE_PASSWORD_ROUTE,
    emailHash
  );

  const info = await transporter.sendMail({
    from: 'Administrador',
    to: email,
    subject: 'Cadastro Senha Palavra da Paz',
    html: `<p>Olá! Esse email foi enviado para criar sua nova senha no sistema do Palavraz de Paz, por favor utilize esse link: ${resetPasswordPath}<p>`
  });

  console.log(info);
};

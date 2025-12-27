import {
  INFO_EMAIL,
  RESET_PASSWORD_FRONTED_ROUTE,
  RESET_PASSWORD_FRONTEND_HOST
} from '@src/config/server';
import { IEmailManager } from '@src/domain/interfaces/repositories/email-manager';
import { encrypt } from '@src/helpers/message-encryption';
import { urlJoin } from 'url-join-ts';

export const sendEmailToVolunteer = async (
  emailManager: IEmailManager,
  email: string
) => {
  const emailHash = encrypt(email);
  const resetPasswordPath = urlJoin(
    RESET_PASSWORD_FRONTEND_HOST,
    RESET_PASSWORD_FRONTED_ROUTE,
    emailHash
  );

  await emailManager.sendEmail({
    sender: INFO_EMAIL,
    receiver: email,
    subject: 'Cadastro Senha Palavra da Paz',
    body: `<p>Olá! Esse email foi enviado para criar sua nova senha no sistema do Palavras de Paz, por favor utilize esse link: ${resetPasswordPath}<p>`
  });
};

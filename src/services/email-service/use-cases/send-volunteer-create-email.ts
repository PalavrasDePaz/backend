import { INFO_EMAIL } from '@src/config/server';
import { IEmailManager } from '@src/domain/interfaces/repositories/email-manager';
import { getVolCreatedEmailBody } from '@src/helpers/get-vol-created-email-body';
import { VolDataForCreatedEmail } from '../types/volunteer-data-for-created-email';

export const sendVolunteerCreatedEmail = async (
  emailManager: IEmailManager,
  volunteerData: VolDataForCreatedEmail
) => {
  const body = getVolCreatedEmailBody(volunteerData);

  await emailManager.sendEmail({
    sender: INFO_EMAIL,
    receiver: volunteerData.email,
    subject: 'Conta criado em Palavras de Paz!',
    body: body,
    attachments: [
      {
        filename: 'ethicscode.pdf',
        path: __dirname + '/attachments/ethicscode.pdf',
        cid: 'uniq-ethicscode.pdf'
      }
    ]
  });
};

import { SupportEmailSendData } from '../types/support-email-send-data';
import { IEmailManager } from '@src/domain/interfaces/repositories/email-manager';

export const sendEmailToSupport = async (
  emailManager: IEmailManager,
  supportEmailSendData: SupportEmailSendData,
  supportEmail: string
) => {
  emailManager.sendEmail({
    sender: supportEmailSendData.email,
    receiver: supportEmail,
    subject: supportEmailSendData.name,
    body: `<p>${supportEmailSendData.message} </p>`
  });
};

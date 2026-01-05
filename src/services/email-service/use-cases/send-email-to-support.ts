import { IEmailManager } from '@src/domain/interfaces/repositories/email-manager';
import { SupportEmailSendData } from '../types/support-email-send-data';

export const sendEmailToSupport = async (
  emailManager: IEmailManager,
  supportEmailSendData: SupportEmailSendData,
  supportEmail: string
) => {
  emailManager.deliverEmail({
    sender: supportEmailSendData.email,
    receiver: supportEmail,
    subject: supportEmailSendData.name,
    body: `<p>${supportEmailSendData.message} </p>`
  });
};

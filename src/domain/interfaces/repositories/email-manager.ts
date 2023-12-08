import { SendEmailData } from '@src/services/email-service/types/send-email-data';

export interface IEmailManager {
  sendEmail(sendEmailData: SendEmailData): Promise<void>;
}

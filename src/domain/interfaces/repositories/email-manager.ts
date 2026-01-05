import { SendEmailData } from '@src/services/email-service/types/send-email-data';

export interface IEmailManager {
  deliverEmail(sendEmailData: SendEmailData): Promise<void>;
}

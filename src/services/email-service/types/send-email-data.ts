export type SendEmailData = {
  sender: string;
  receiver: string;
  subject: string;
  body: string;
  attachments?: {
    filename: string;
    path: string;
    cid: string;
  }[];
};

/**
 * @example {
 *  "email": "test@gmail.com",
 *  "subject": "Subject",
 *  "message": "Message"
 * }
 */
export type SupportEmailSendData = {
  name: string;
  /**
   * @pattern ^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$ must be a valid email
   * @example "test@gmail.com"
   */
  email: string;
  subject: string;
  message: string;
};

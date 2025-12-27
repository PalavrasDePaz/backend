import {
  HELPDESK_EMAIL,
  HELPDESK_EMAIL_PASSWORD,
  HELPDESK_EMAIL_USER,
  IMAP_PORT,
  IMAP_SECURE,
  IMAP_SERVER,
  INFO_EMAIL,
  INFO_EMAIL_PASSWORD,
  INFO_EMAIL_USER,
  SMTP_PASS,
  SMTP_PORT,
  SMTP_SECURE,
  SMTP_SERVER,
  SMTP_USER
} from '@src/config/server';
import { SendEmailError } from '@src/domain/errors/send-email';
import { IEmailManager } from '@src/domain/interfaces/repositories/email-manager';
import { provideSingleton } from '@src/helpers/provide-singleton';
import { ImapFlow } from 'imapflow';
import nodemailer from 'nodemailer';
import { SendEmailData } from './types/send-email-data';

type ImapAuth = { user: string; pass: string };

@provideSingleton(EmailManager)
export class EmailManager implements IEmailManager {
  private infoTransporter = nodemailer.createTransport({
    host: SMTP_SERVER,
    port: SMTP_PORT,
    secure: SMTP_SECURE,
    auth: { user: INFO_EMAIL_USER, pass: INFO_EMAIL_PASSWORD },
    tls: { rejectUnauthorized: false }
  });

  private helpdeskTransporter = nodemailer.createTransport({
    host: SMTP_SERVER,
    port: SMTP_PORT,
    secure: false,
    auth: { user: HELPDESK_EMAIL_USER, pass: HELPDESK_EMAIL_PASSWORD },
    tls: { rejectUnauthorized: false }
  });

  private defaultTransporter = nodemailer.createTransport({
    host: SMTP_SERVER,
    port: SMTP_PORT,
    secure: false,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
    tls: { rejectUnauthorized: false }
  });

  /**
   * Adjust if your server uses a different Sent mailbox name.
   * Common alternatives: "INBOX.Sent", "Sent Items"
   */
  private sentMailboxName = 'Sent';

  private pickTransporter(sender: string): nodemailer.Transporter {
    switch (sender) {
      case INFO_EMAIL:
        return this.infoTransporter;
      case HELPDESK_EMAIL:
        return this.helpdeskTransporter;
      default:
        return this.defaultTransporter;
    }
  }

  private pickImapAuth(sender: string): ImapAuth {
    switch (sender) {
      case INFO_EMAIL:
        return { user: INFO_EMAIL_USER, pass: INFO_EMAIL_PASSWORD };
      case HELPDESK_EMAIL:
        return { user: HELPDESK_EMAIL_USER, pass: HELPDESK_EMAIL_PASSWORD };
      default:
        return { user: SMTP_USER, pass: SMTP_PASS };
    }
  }

  private async appendToSent(opts: {
    raw: Buffer | string;
    auth: ImapAuth;
    sentMailboxName?: string;
  }): Promise<void> {
    if (!IMAP_SERVER) return;

    const client = new ImapFlow({
      host: IMAP_SERVER,
      port: IMAP_PORT,
      secure: IMAP_SECURE,
      auth: opts.auth,
      tls: { rejectUnauthorized: false }
    });

    const mailbox = opts.sentMailboxName ?? this.sentMailboxName;

    try {
      await client.connect();

      try {
        await client.mailboxOpen(mailbox);
      } catch {
        await client.mailboxCreate(mailbox);
      }

      await client.append(mailbox, opts.raw, ['\\Seen']);
    } finally {
      try {
        await client.logout();
      } catch {
        // ignore
      }
    }
  }

  async sendEmail(sendEmailData: SendEmailData): Promise<void> {
    try {
      const transporter = this.pickTransporter(sendEmailData.sender);
      const imapAuth = this.pickImapAuth(sendEmailData.sender);

      const info = await transporter.sendMail({
        from: sendEmailData.sender,
        to: sendEmailData.receiver,
        subject: sendEmailData.subject,
        html: sendEmailData.body,
        attachments: sendEmailData.attachments
      });

      if (info?.message) {
        await this.appendToSent({ raw: info.message, auth: imapAuth });
      }
    } catch (error) {
      throw new SendEmailError({
        name: 'COULD_NOT_SEND_EMAIL_ERROR',
        message: `Could not send email to ${sendEmailData.receiver}`,
        details: error
      });
    }
  }
}

import {
  HELPDESK_EMAIL,
  HELPDESK_EMAIL_PASSWORD,
  HELPDESK_EMAIL_USER,
  IMAP_PORT,
  IMAP_SECURE,
  IMAP_SENT_MAILBOX_NAME,
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
import MailComposer from 'nodemailer/lib/mail-composer';
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
    secure: SMTP_SECURE,
    auth: { user: HELPDESK_EMAIL_USER, pass: HELPDESK_EMAIL_PASSWORD },
    tls: { rejectUnauthorized: false }
  });

  private defaultTransporter = nodemailer.createTransport({
    host: SMTP_SERVER,
    port: SMTP_PORT,
    secure: SMTP_SECURE,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
    tls: { rejectUnauthorized: false }
  });

  /**
   * Must match exactly what your IMAP server exposes.
   * Common: "Sent", "INBOX.Sent", "Sent Items"
   */
  private sentMailboxName = IMAP_SENT_MAILBOX_NAME;

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

  private async buildRawMessage(sendEmailData: SendEmailData): Promise<Buffer> {
    const composer = new MailComposer({
      from: sendEmailData.sender,
      to: sendEmailData.receiver,
      subject: sendEmailData.subject,
      html: sendEmailData.body,
      attachments: sendEmailData.attachments
    });

    const raw = await composer.compile().build();
    return raw;
  }

  private async appendToSent(opts: {
    raw: Buffer;
    auth: ImapAuth;
  }): Promise<void> {
    if (!IMAP_SERVER) return;

    const client = new ImapFlow({
      host: IMAP_SERVER,
      port: IMAP_PORT,
      secure: IMAP_SECURE,
      auth: opts.auth,
      tls: { rejectUnauthorized: false }
    });

    try {
      await client.connect();

      // Try open, otherwise create then open
      try {
        await client.mailboxOpen(this.sentMailboxName);
      } catch {
        await client.mailboxCreate(this.sentMailboxName);
        await client.mailboxOpen(this.sentMailboxName);
      }

      await client.append(this.sentMailboxName, opts.raw, ['\\Seen']);
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

      // Build the exact raw message once, reuse it for both actions
      const raw = await this.buildRawMessage(sendEmailData);

      // Send via SMTP using the raw message
      await transporter.sendMail({
        envelope: {
          from: sendEmailData.sender,
          to: [sendEmailData.receiver]
        },
        raw
      });

      // Append into IMAP Sent
      await this.appendToSent({ raw, auth: imapAuth });
    } catch (error) {
      throw new SendEmailError({
        name: 'COULD_NOT_SEND_EMAIL_ERROR',
        message: `Could not send email to ${sendEmailData.receiver}`,
        details: error
      });
    }
  }
}

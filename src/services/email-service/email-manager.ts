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

  /** Sent mailbox name */
  private sentMailboxName = IMAP_SENT_MAILBOX_NAME || 'Sent';

  /** Inbox mailbox name */
  private inboxMailboxName = 'INBOX';

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

  /** IMAP auth for sender (used for Sent) */
  private pickImapAuthForSender(sender: string): ImapAuth {
    switch (sender) {
      case INFO_EMAIL:
        return { user: INFO_EMAIL_USER, pass: INFO_EMAIL_PASSWORD };
      case HELPDESK_EMAIL:
        return { user: HELPDESK_EMAIL_USER, pass: HELPDESK_EMAIL_PASSWORD };
      default:
        return { user: SMTP_USER, pass: SMTP_PASS };
    }
  }

  /** IMAP auth for recipient (used for Inbox injection) - may have different credentials */
  private pickImapAuthForRecipient(recipient: string): ImapAuth {
    switch (recipient) {
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
      attachments: sendEmailData.attachments,
      headers: {
        'X-Injected-By': 'WebsiteBackend'
      }
    });

    return await composer.compile().build();
  }

  private async appendToMailbox(opts: {
    raw: Buffer;
    auth: ImapAuth;
    mailbox: string;
    flags?: string[];
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

      try {
        await client.mailboxOpen(opts.mailbox);
      } catch {
        if (opts.mailbox.toUpperCase() !== 'INBOX') {
          await client.mailboxCreate(opts.mailbox);
        }
        await client.mailboxOpen(opts.mailbox);
      }

      await client.append(opts.mailbox, opts.raw, opts.flags ?? []);
    } finally {
      try {
        await client.logout();
      } catch {
        // ignore
      }
    }
  }

  private async appendToSent(opts: {
    raw: Buffer;
    auth: ImapAuth;
  }): Promise<void> {
    await this.appendToMailbox({
      raw: opts.raw,
      auth: opts.auth,
      mailbox: this.sentMailboxName,
      flags: ['\\Seen']
    });
  }

  /** Outbound SMTP + append to Sent */
  async sendEmail(sendEmailData: SendEmailData): Promise<void> {
    try {
      const transporter = this.pickTransporter(sendEmailData.sender);
      const imapAuth = this.pickImapAuthForSender(sendEmailData.sender);

      const raw = await this.buildRawMessage(sendEmailData);

      await transporter.sendMail({
        envelope: {
          from: sendEmailData.sender,
          to: [sendEmailData.receiver]
        },
        raw
      });

      await this.appendToSent({ raw, auth: imapAuth });
    } catch (error) {
      throw new SendEmailError({
        name: 'COULD_NOT_SEND_EMAIL_ERROR',
        message: `Could not send email to ${sendEmailData.receiver}`,
        details: error
      });
    }
  }

  /** Insert message directly into recipient INBOX */
  async injectIncomingEmail(sendEmailData: SendEmailData): Promise<void> {
    try {
      const raw = await this.buildRawMessage(sendEmailData);
      const recipientAuth = this.pickImapAuthForRecipient(
        sendEmailData.receiver
      );

      await this.appendToMailbox({
        raw,
        auth: recipientAuth,
        mailbox: this.inboxMailboxName,
        flags: []
      });
    } catch (error) {
      throw new SendEmailError({
        name: 'COULD_NOT_INJECT_EMAIL_ERROR',
        message: `Could not inject email into INBOX of ${sendEmailData.receiver}`,
        details: error
      });
    }
  }

  /** Send outbound or inject locally */
  async deliverEmail(sendEmailData: SendEmailData): Promise<void> {
    const receiver = (sendEmailData.receiver || '').toLowerCase();

    const isLocal =
      receiver === INFO_EMAIL.toLowerCase() ||
      receiver === HELPDESK_EMAIL.toLowerCase();

    if (isLocal) {
      await this.injectIncomingEmail(sendEmailData);
      return;
    }

    await this.sendEmail(sendEmailData);
  }
}

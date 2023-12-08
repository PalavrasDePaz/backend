import { VolDataForCreatedEmail } from '@src/services/email-service/types/volunteer-data-for-created-email';
import { render } from 'ejs';
import { readFileSync } from 'fs';

const EMAIL_BODY_TEMPLATE_PATH =
  'src/services/email-service/created-volunteer-body.html';

export const getVolCreatedEmailBody = (
  volunteerData: VolDataForCreatedEmail
): string => {
  const template = readFileSync(EMAIL_BODY_TEMPLATE_PATH).toString();
  return render(template, {
    name: volunteerData.name,
    idvol: volunteerData.idvol
  });
};

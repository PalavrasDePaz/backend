import { VolDataForCreatedEmail } from '@src/services/email-service/types/volunteer-data-for-created-email';
import { render } from 'ejs';
import { readFileSync } from 'fs';

const EMAIL_BODY_TEMPLATE_PATH =
  'src/services/email-service/created-volunteer-body.html';

const EMAIL_BODY_ALTERNATIVE_TEMPLATE_PATH =
  'src/services/email-service/created-volunteer-alternative-body.html';

let template = '';
export const getVolCreatedEmailBody = (
  volunteerData: VolDataForCreatedEmail
): string => {
  if (volunteerData.pep) {
    template = readFileSync(EMAIL_BODY_ALTERNATIVE_TEMPLATE_PATH).toString();
  } else {
    template = readFileSync(EMAIL_BODY_TEMPLATE_PATH).toString();
  }
  return render(template, {
    name: volunteerData.name,
    idvol: volunteerData.idvol
  });
};

import { VolunteerJWTPayload } from '../types/volunteer-jwt-payload';
import { Request } from 'express';

export const checkAuthorization = (
  req: Request,
  loggedVolunteer: VolunteerJWTPayload,
  scopes?: string[]
) => {
  const authorizedRoles =
    scopes?.every((scope) => scope in loggedVolunteer) ?? true;

  let authorizedVolunteer = true;
  if (req.params.email || req.params.idvol) {
    authorizedVolunteer =
      loggedVolunteer.email == req.params.email ||
      loggedVolunteer.idvol == Number(req.params.idvol);
  }

  return authorizedRoles && authorizedVolunteer;
};

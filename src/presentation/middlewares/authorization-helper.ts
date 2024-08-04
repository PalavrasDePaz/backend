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
  if (
    !loggedVolunteer.manageVolunteerModulePermission &&
    (req.params.email || req.params.idvol || req.body.email || req.body.idvol)
  ) {
    authorizedVolunteer =
      loggedVolunteer.email == req.params.email ||
      loggedVolunteer.idvol == Number(req.params.idvol) ||
      loggedVolunteer.email == req.body.email ||
      loggedVolunteer.idvol == Number(req.body.idvol);
  }

  return authorizedRoles && authorizedVolunteer;
};

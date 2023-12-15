import { VolunteerWithAuthEntity } from './volunteer-with-auth-entity';

export type CreateVolunteerEntity = Omit<
  VolunteerWithAuthEntity,
  'idvol' | 'createdAt' | 'isDisability' | 'opportunities'  | 'notebookPermission' | 'bookclubPermission' | 'authorization' | 'certificate' | 'courseOne' | 'courseTwo'
>;

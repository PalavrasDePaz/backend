import { VolunteerWithAuthEntity } from './volunteer-with-auth-entity';

export type CreateVolunteerEntity = Omit<
  VolunteerWithAuthEntity,
  'idvol' | 'createdAt' | 'isDisability' | 'opportunities'  | 'readSkill' | 'bookSkill' | 'authorization' | 'certificate' | 'courseOne' | 'courseTwo'
>;

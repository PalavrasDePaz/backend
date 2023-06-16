import { VolunteerWithAuthEntity } from './volunteer-with-auth-entity';

export type CreateVolunteerEntity = Omit<VolunteerWithAuthEntity, 'idvol'>;

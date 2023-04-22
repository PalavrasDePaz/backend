import { VolunteerAuthDataEntity } from './volunteer-auth-entity';
import { VolunteerEntity } from './volunteer-entity';

export type VolunteerWithAuthEntity = VolunteerEntity & VolunteerAuthDataEntity;

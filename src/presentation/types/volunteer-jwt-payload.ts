import { VolunteerAuthDataEntity } from '@src/domain/entities/volunteer/volunteer-auth-entity';
import { VolunteerEntity } from '@src/domain/entities/volunteer/volunteer-entity';

export type VolunteerJWTPayload = Omit<VolunteerAuthDataEntity, 'password'> &
  Pick<VolunteerEntity, 'idvol'>;

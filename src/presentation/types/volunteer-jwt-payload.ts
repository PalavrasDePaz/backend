import { VolunteerAuthDataEntity } from '@src/domain/entities/volunteer-auth-entity';
import { VolunteerEntity } from '@src/domain/entities/volunteer-entity';

export type VolunteerJWTPayload = Omit<VolunteerAuthDataEntity, 'password'> &
  Pick<VolunteerEntity, 'idvol'>;

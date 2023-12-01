import { VolunteerEntity } from '@src/domain/entities/volunteer/volunteer-entity';
import { VolunteerAuthDataEntity } from './volunteer-auth-entity';

export type UpdateVolunteerEntity = Partial<
  Omit<
    VolunteerEntity,
    'pep' | 'idvol' | 'createdAt' | 'isDisability' | 'opportunities'
  > &
    Pick<VolunteerAuthDataEntity, 'password'>
>;

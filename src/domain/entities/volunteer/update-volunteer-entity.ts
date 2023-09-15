import { VolunteerEntity } from '@src/domain/entities/volunteer/volunteer-entity';

export type UpdateVolunteerEntity = Omit<
  VolunteerEntity,
  'email' | 'pep' | 'idvol' | 'createdAt'
>;

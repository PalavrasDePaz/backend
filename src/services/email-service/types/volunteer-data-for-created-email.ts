import { VolunteerEntity } from '@src/domain/entities/volunteer/volunteer-entity';

export type VolDataForCreatedEmail = Pick<
  VolunteerEntity,
  'idvol' | 'name' | 'email' | 'pep'
>;

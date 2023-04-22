import { VolunteerEntity } from '@src/domain/entities/volunteer-entity';

export type UpdateVolunteerEntity = Omit<VolunteerEntity, 'email' | 'pep'>;

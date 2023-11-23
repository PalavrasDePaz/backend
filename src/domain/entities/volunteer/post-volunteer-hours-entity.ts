import { VolunteerHoursEntity } from './volunteer-hours-entity';
export type PostVolunteerHoursEntity = Omit<
  VolunteerHoursEntity,
  'idHour' | 'createdAt'
>;

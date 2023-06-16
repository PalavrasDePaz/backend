import { VolunteerWithAuthEntity } from '@src/domain/entities/volunteer/volunteer-with-auth-entity';
import volunteerEntityDummy from './volunteer-entity-dummy';

const volunteerWithAuthEntityDummy: VolunteerWithAuthEntity = {
  password: 'test',
  authorPermission: 'test',
  readPermission: true,
  bookPermission: true,
  certificationPermission: true,
  ...volunteerEntityDummy
};

export default volunteerWithAuthEntityDummy;

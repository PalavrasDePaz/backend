import { CreateVolunteerEntity } from '@src/domain/entities/volunteer/create-volunteer-entity';
import volunteerWithAuthEntityDummy from './volunteer-with-auth-entity-dummy';

const createVolunteerEntityDummy: CreateVolunteerEntity = {
  ...volunteerWithAuthEntityDummy
};

export default createVolunteerEntityDummy;

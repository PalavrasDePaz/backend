import { VolunteerWithAuthEntity } from "@src/domain/entities/volunteer-with-auth-entity";
import volunteerDummy from "./volunteer-dummy";

const volunteerWithAuthDummy: VolunteerWithAuthEntity = {
  password: 'test',
  authorPermission: 'test',
  readPermission: true,
  bookPermission: true,
  certificationPermission: true,
  ...volunteerDummy
}

export default volunteerWithAuthDummy
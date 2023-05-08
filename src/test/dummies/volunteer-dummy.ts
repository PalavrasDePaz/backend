import { VolunteerEntity } from '@src/domain/entities/volunteer-entity';

const volunteerDummy: VolunteerEntity = {
  email: 'test@gmail.com',
  name: 'test',
  pep: 1,
  birthDate: new Date('2023-03-01T02:27:27.610Z'),
  phoneNumber: 'test',
  country: 'test',
  state: 'test',
  city: 'test',
  ethnicity: 'test',
  gender: 'test',
  howFoundPep: 'test',
  knowledgePep: 'test',
  workshops: ['test'],
  schooling: 'test',
  studiesKnowlegde: 'test',
  lifeExperience: 'test',
  desires: 'test',
  rolesPep: ['test'],
  weekAvailability: 20,
  meetingAvailability: 'test',
  contribution: 'test',
  needDeclaration: false,
  bachelor: 'test',
  sex: 'test',
  socialName: 'test',
  disability: undefined,
  interestFutureRoles: ['test']
};

export default volunteerDummy;

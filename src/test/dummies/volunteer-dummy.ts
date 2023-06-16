import { VolunteerEntity } from '@src/domain/entities/volunteer-entity';

const volunteerDummy: VolunteerEntity = {
  email: 'test@gmail.com',
  idvol: 1,
  name: 'test',
  pep: 1,
  birthDate: new Date('2023-03-01T02:27:27.610Z'),
  phoneNumber: 'test',
  country: 'test',
  state: 'test',
  city: 'test',
  howFoundPep: 'test',
  knowledgePep: 'test',
  schooling: 'test',
  studiesKnowledge: 'test',
  lifeExperience: 'test',
  desires: 'test',
  rolesPep: ['test'],
  needDeclaration: false,
  bachelor: 'test',
  disability: undefined,
  interestFutureRoles: ['test']
};

export default volunteerDummy;

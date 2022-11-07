import { SequelizeVolunteerRepository } from '@src/domain/repositories/sequelize-volunteer-controller';
import { VolunteerRepository } from '@src/domain/interfaces/repositories/volunteer-repository';
import { VolunteerEntity } from '@src/domain/entities/volunteer-entity';
import initModels from '@src/services/database';
import sequelize from '@src/services/database/sequelize';
import volunteerDummy from '../dummies/volunteer-dummy';

describe('Volunteer Controller', () => {
  let volunteerRepository: VolunteerRepository;

  beforeAll(() => {
    initModels();
    volunteerRepository = new SequelizeVolunteerRepository();
  });

  afterAll(() => {
    sequelize.close();
  });

  it('Should get a volunteer by the email', async () => {
    const volunteer: VolunteerEntity = volunteerDummy;

    await volunteerRepository.createVolunteer(volunteer);

    const result = await volunteerRepository.getVolunteerByEmail(
      volunteer.email
    );

    expect(result).toEqual(volunteer);
    await volunteerRepository.deleteVolunteerByEmail(volunteer.email);
  });

  it('Should create a new volunteer', async () => {
    const volunteer: VolunteerEntity = volunteerDummy;

    const result = await volunteerRepository.createVolunteer(volunteer);
    const searched = await volunteerRepository.getVolunteerByEmail(
      volunteer.email
    );

    expect(result).toEqual(volunteer);
    expect(searched).toEqual(volunteer);

    await volunteerRepository.deleteVolunteerByEmail(volunteer.email);
  });

  it('Should update a volunteer by the email', async () => {
    const volunteer: VolunteerEntity = volunteerDummy;
    await volunteerRepository.createVolunteer(volunteer);

    const result = await volunteerRepository.updateVolunteer(volunteer.email, {
      name: 'newName'
    });

    const searched = await volunteerRepository.getVolunteerByEmail(
      volunteer.email
    );

    expect(searched?.name).toBe('newName');
    expect(result).toBeTruthy();
    await volunteerRepository.deleteVolunteerByEmail(volunteer.email);
  });

  it('Should delete a volunteer', async () => {
    const volunteer: VolunteerEntity = volunteerDummy;
    await volunteerRepository.createVolunteer(volunteer);

    const numDeletedRows = await volunteerRepository.deleteVolunteerByEmail(
      volunteer.email
    );

    expect(numDeletedRows).toBe(1);

    const result = await volunteerRepository.getVolunteerByEmail(
      volunteer.email
    );
    expect(result).toBeNull();
  });
});

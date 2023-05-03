import { SequelizeVolunteerRepository } from '@src/services/repositories/sequelize-volunteer-repository';
import { VolunteerRepository } from '@src/domain/interfaces/repositories/volunteer-repository';
// import { VolunteerEntity } from '@src/domain/entities/volunteer-entity';
import initModels from '@src/services/database';
import sequelize from '@src/services/database/sequelize';
// import volunteerDummy from '../dummies/volunteer-dummy';
import { VolunteerWithAuthEntity } from '@src/domain/entities/volunteer-with-auth-entity';
import volunteerWithAuthDummy from '../dummies/volunteer-auth-entity-dummy';
import { Volunteer } from '@src/services/database/models/volunteer';
import volunteerModel from '../dummies/volunteer-model';

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
    const volunteer: VolunteerWithAuthEntity = volunteerWithAuthDummy;

    // await volunteerRepository.createVolunteer(volunteer);
    jest.spyOn(Volunteer, 'findOne').mockResolvedValue(volunteerModel as unknown as Volunteer);

    const result = await volunteerRepository.getVolunteerByEmail(
      volunteer.email
    );

    expect(result).toEqual(volunteer);
    // await volunteerRepository.deleteVolunteerByEmail(volunteer.email);
  });

  it('Should create a new volunteer', async () => {
    const volunteer: VolunteerWithAuthEntity = volunteerWithAuthDummy;

    jest.spyOn(Volunteer, 'create').mockResolvedValue(volunteerModel as unknown as Volunteer);

    const result = await volunteerRepository.createVolunteer(volunteer);
    // const searched = await volunteerRepository.getVolunteerByEmail(
    //   volunteer.email
    // );

    expect(result).toEqual(volunteer);
    // expect(searched).toEqual(volunteer);

    // await volunteerRepository.deleteVolunteerByEmail(volunteer.email);
  });

  it('Should update a volunteer by the email', async () => {
    const volunteer: VolunteerWithAuthEntity = volunteerWithAuthDummy;
    // await volunteerRepository.createVolunteer(volunteer);

    jest.spyOn(Volunteer, 'update').mockResolvedValue([1]);
    jest.spyOn(volunteerRepository, 'getVolunteerByEmail').mockResolvedValue(
      { ...volunteer, name: "newName"}
    );

    const result = await volunteerRepository.updateVolunteer(
      { ...volunteer, name: "newName"}, volunteer.email
    );

    // const searched = await volunteerRepository.getVolunteerByEmail(
    //   volunteer.email
    // );

    expect(result?.name).toBe('newName');
    expect(result).toBeTruthy();
    // await volunteerRepository.deleteVolunteerByEmail(volunteer.email);
  });

  it('Should delete a volunteer', async () => {
    const volunteer: VolunteerWithAuthEntity = volunteerWithAuthDummy;
    // await volunteerRepository.createVolunteer(volunteer);
    jest.spyOn(Volunteer, 'destroy').mockResolvedValue(1);

    await volunteerRepository.deleteVolunteerByEmail(
      volunteer.email
    );

    expect(Volunteer.destroy).toHaveBeenCalled();

    // const result = await volunteerRepository.getVolunteerByEmail(
    //   volunteer.email
    // );
    // expect(result).toBeNull();
  });
});

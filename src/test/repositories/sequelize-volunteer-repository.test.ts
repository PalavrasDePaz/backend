import { SequelizeVolunteerRepository } from '@src/services/repositories/sequelize-volunteer-repository';
import { VolunteerRepository } from '@src/domain/interfaces/repositories/volunteer-repository';
import initModels from '@src/services/database';
import sequelize from '@src/services/database/sequelize';
import { VolunteerWithAuthEntity } from '@src/domain/entities/volunteer-with-auth-entity';
import volunteerWithAuthDummy from '../dummies/volunteer-auth-entity-dummy';
import { Volunteer } from '@src/services/database/models/volunteer';
import volunteerModel from '../dummies/volunteer-model';
import { ValidationError, ValidationErrorItem } from 'sequelize';
import { VolunteerEntity } from '@src/domain/entities/volunteer-entity';
import volunteerDummy from '../dummies/volunteer-dummy';

describe('Volunteer Repositories', () => {
  let volunteerRepository: VolunteerRepository;

  beforeAll(() => {
    initModels();
    volunteerRepository = new SequelizeVolunteerRepository();
    jest.clearAllMocks();
  });

  afterAll(() => {
    sequelize.close();
  });

  it('Should get a volunteer by the email', async () => {
    const volunteer: VolunteerEntity = volunteerDummy;

    jest
      .spyOn(Volunteer, 'findOne')
      .mockResolvedValue(volunteerModel as unknown as Volunteer);

    const result = await volunteerRepository.getVolunteerByEmail(
      volunteer.email
    );

    expect(result).toEqual(volunteer);
  });

  it('Should create a new volunteer', async () => {
    const volunteerWithAuth: VolunteerWithAuthEntity = volunteerWithAuthDummy;
    const volunteer: VolunteerEntity = volunteerDummy;

    jest
      .spyOn(Volunteer, 'create')
      .mockResolvedValue(volunteerModel as unknown as Volunteer);

    const result = await volunteerRepository.createVolunteer(volunteerWithAuth);

    expect(result).toEqual(volunteer);
  });

  it('Should update a volunteer by the email', async () => {
    const volunteer: VolunteerWithAuthEntity = volunteerWithAuthDummy;

    jest.spyOn(Volunteer, 'update').mockResolvedValue([1]);
    jest
      .spyOn(volunteerRepository, 'getVolunteerByEmail')
      .mockResolvedValue({ ...volunteer, name: 'newName' });

    const result = await volunteerRepository.updateVolunteer(
      { ...volunteer, name: 'newName' },
      volunteer.email
    );

    expect(result?.name).toBe('newName');
    expect(result).toBeTruthy();
  });

  it('Should delete a volunteer', async () => {
    const volunteer: VolunteerWithAuthEntity = volunteerWithAuthDummy;
    jest.spyOn(Volunteer, 'destroy').mockResolvedValue(1);

    await volunteerRepository.deleteVolunteerByEmail(volunteer.email);

    expect(Volunteer.destroy).toHaveBeenCalled();
  });

  it('Should get volunteer with auth data', async () => {
    const volunteer: VolunteerWithAuthEntity = volunteerWithAuthDummy;

    jest.restoreAllMocks();
    jest
      .spyOn(Volunteer, 'findOne')
      .mockResolvedValue(volunteerModel as unknown as Volunteer);

    const result = await volunteerRepository.getVolunteerWithAuthDataByEmail(
      volunteer.email
    );

    expect(result).toEqual(volunteer);
  });

  it('Should throw error when trying to create an already existing email', async () => {
    const volunteer: VolunteerWithAuthEntity = volunteerWithAuthDummy;
    const validationErrorItem = {
      message: 'E-MAIL must be unique'
    };

    jest
      .spyOn(Volunteer, 'create')
      .mockRejectedValue(
        new ValidationError('E-MAIL must be unique', [
          validationErrorItem as unknown as ValidationErrorItem
        ])
      );

    await expect(
      volunteerRepository.createVolunteer(volunteer)
    ).rejects.toThrow(`Volunteer with email ${volunteer.email} already exists`);
  });

  it('Should create a new password if it does not exists', async () => {
    const volunteer: VolunteerEntity = volunteerDummy;

    jest.clearAllMocks();
    jest.spyOn(Volunteer, 'update').mockResolvedValue([1]);

    const result = await volunteerRepository.updateOrCreatePasswordForEmail(
      volunteer.email,
      'newpassword'
    );

    expect(result).toBeTruthy();
  });

  it('Should get an array with all volunteers', async () => {
    const volunteers: VolunteerEntity[] = [volunteerDummy];

    jest
      .spyOn(Volunteer, 'findAll')
      .mockResolvedValue([volunteerModel] as Volunteer[]);

    const result = await volunteerRepository.getAllVolunteers();

    expect(result).toEqual(volunteers);
  });
});

import { SequelizeVolunteerRepository } from '@src/services/repositories/sequelize-volunteer-repository';
import { VolunteerRepository } from '@src/domain/interfaces/repositories/volunteer-repository';
import initModels from '@src/services/database';
import sequelize from '@src/services/database/sequelize';
import { VolunteerWithAuthEntity } from '@src/domain/entities/volunteer-with-auth-entity';
import volunteerWithAuthDummy from '../dummies/volunteer-auth-entity-dummy';
import { Volunteer } from '@src/services/database/models/volunteer';
import volunteerModel from '../dummies/volunteer-model';
// import { VolunteerError } from '@src/domain/errors/volunteer';
import { ValidationError, ValidationErrorItem } from 'sequelize';

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
    const volunteer: VolunteerWithAuthEntity = volunteerWithAuthDummy;

    jest
      .spyOn(Volunteer, 'findOne')
      .mockResolvedValue(volunteerModel as unknown as Volunteer);

    const result = await volunteerRepository.getVolunteerByEmail(
      volunteer.email
    );

    // volunteerFindOne.mockClear();
    expect(result).toEqual(volunteer);
  });

  it('Should create a new volunteer', async () => {
    const volunteer: VolunteerWithAuthEntity = volunteerWithAuthDummy;

    jest
      .spyOn(Volunteer, 'create')
      .mockResolvedValue(volunteerModel as unknown as Volunteer);

    const result = await volunteerRepository.createVolunteer(volunteer);

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
  
  it('Should throw error if searched volunteer is not found', async () => {
    const volunteer: VolunteerWithAuthEntity = volunteerWithAuthDummy;

    jest.restoreAllMocks();
    jest
      .spyOn(Volunteer, 'findOne')
      .mockResolvedValue(null);

    await expect(
      volunteerRepository.getVolunteerByEmail(volunteer.email)
      ).rejects.toThrow('Volunteer not found');
  });

  it('Should throw error when trying to create an already existing email', async () => {
    const volunteer: VolunteerWithAuthEntity = volunteerWithAuthDummy;
    const validationErrorItem = {
      message: 'E-MAIL must be unique',
    }

    jest
      .spyOn(Volunteer, 'create')
      .mockRejectedValue(new ValidationError('E-MAIL must be unique',
      [validationErrorItem as unknown as ValidationErrorItem]));

    await expect(
      volunteerRepository.createVolunteer(volunteer)
      ).rejects.toThrow(`Volunteer with email ${volunteer.email} already exists`);
  });
});

import { VolunteerRepository } from '@src/domain/interfaces/repositories/volunteer-repository';
import { VolunteerEntity } from '@src/domain/entities/volunteer/volunteer-entity';
import { VolunteerAPI } from '@src/presentation/api/volunteer';
import { VolunteerWithAuthEntity } from '@src/domain/entities/volunteer/volunteer-with-auth-entity';
import volunteerWithAuthEntityDummy from '../dummies/volunteer-with-auth-entity-dummy';
import { UpdateVolunteerEntity } from '@src/domain/entities/volunteer/update-volunteer-entity';
import { ApiError } from '@src/presentation/types/api-error';
import { VolunteerError } from '@src/domain/errors/volunteer';

describe('Volunteer API', () => {
  let volunteerRepository: VolunteerRepository;
  let volunteerAPI: VolunteerAPI;
  const volunteer: VolunteerWithAuthEntity = volunteerWithAuthEntityDummy;

  class MockVolunteerRepository implements VolunteerRepository {
    getVolunteerById(_id: number): Promise<VolunteerEntity | null> {
      throw new Error('Method not implemented.');
    }
    updateVolunteer(
      _volunteer: UpdateVolunteerEntity,
      _email: string
    ): Promise<VolunteerEntity | null> {
      throw new Error('Method not implemented.');
    }
    getVolunteerByEmail(_email: string): Promise<VolunteerEntity | null> {
      throw new Error('Method not implemented.');
    }
    getVolunteerWithAuthDataByEmail(
      _email: string
    ): Promise<VolunteerWithAuthEntity | null> {
      throw new Error('Method not implemented.');
    }
    getAllVolunteers(): Promise<VolunteerEntity[]> {
      throw new Error('Method not implemented.');
    }
    createVolunteer(
      _volunteer: VolunteerWithAuthEntity
    ): Promise<VolunteerEntity> {
      throw new Error('Method not implemented.');
    }
    deleteVolunteerByEmail(_email: string): Promise<boolean> {
      throw new Error('Method not implemented.');
    }
    updateOrCreatePasswordForEmail(
      _email: string,
      _password: string
    ): Promise<boolean> {
      throw new Error('Method not implemented.');
    }
  }

  beforeAll(() => {
    volunteerRepository = new MockVolunteerRepository();
    volunteerAPI = new VolunteerAPI(volunteerRepository);
    jest.clearAllMocks();
  });

  it('Should get a user by the email', async () => {
    jest
      .spyOn(volunteerRepository, 'getVolunteerByEmail')
      .mockResolvedValue(volunteer);

    const volunteerResponse = await volunteerAPI.getVolunteerByEmail(
      volunteer.email
    );
    expect(volunteerResponse).toEqual(volunteer);
  });

  it('Should throw an error if volunteer does not exists when getting by email', async () => {
    jest
      .spyOn(volunteerRepository, 'getVolunteerByEmail')
      .mockResolvedValue(null);

    const unkownEmail = 'notfound@gmail.com';

    const expectedError = new ApiError(
      400,
      new VolunteerError({
        name: 'VOLUNTEER_NOT_FOUND',
        message: `Volunteer with email ${unkownEmail} not found`
      })
    );

    expect(volunteerAPI.getVolunteerByEmail(unkownEmail)).rejects.toThrow(
      expectedError
    );
  });

  it('Should create or update password', async () => {
    jest
      .spyOn(volunteerRepository, 'updateOrCreatePasswordForEmail')
      .mockResolvedValue(true);

    expect(
      volunteerAPI.createOrUpdatePassword(volunteer.email, {
        password: volunteer.password
      })
    ).resolves.not.toThrow();
  });

  it('Should throw an error if volunteer is not found when creating or updating password', async () => {
    jest
      .spyOn(volunteerRepository, 'updateOrCreatePasswordForEmail')
      .mockResolvedValue(false);

    const expectedError = new ApiError(
      400,
      new VolunteerError({
        name: 'VOLUNTEER_NOT_FOUND',
        message:
          'Could not create or update volunteer password because it was not found'
      })
    );

    expect(
      volunteerAPI.createOrUpdatePassword(volunteer.email, {
        password: volunteer.password
      })
    ).rejects.toThrow(expectedError);
  });

  it('Should delete volunteer', async () => {
    jest
      .spyOn(volunteerRepository, 'deleteVolunteerByEmail')
      .mockResolvedValue(true);

    expect(
      volunteerAPI.deleteVolunteer(volunteer.email)
    ).resolves.not.toThrow();
  });

  it('Should throw an error if volunteer to delete is not found', async () => {
    jest
      .spyOn(volunteerRepository, 'deleteVolunteerByEmail')
      .mockResolvedValue(false);

    const expectedError = new ApiError(
      400,
      new VolunteerError({
        name: 'VOLUNTEER_NOT_FOUND',
        message: `Volunteer with email ${volunteer.email} not deleted`
      })
    );

    expect(volunteerAPI.deleteVolunteer(volunteer.email)).rejects.toThrow(
      expectedError
    );
  });
});

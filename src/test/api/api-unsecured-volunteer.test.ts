import { VolunteerRepository } from '@src/domain/interfaces/repositories/volunteer-repository';
import { VolunteerEntity } from '@src/domain/entities/volunteer/volunteer-entity';
import { VolunteerWithAuthEntity } from '@src/domain/entities/volunteer/volunteer-with-auth-entity';
import volunteerWithAuthEntityDummy from '../dummies/volunteer-with-auth-entity-dummy';
import { VolunteerError } from '@src/domain/errors/volunteer';
import { verify } from 'jsonwebtoken';
import { UpdateVolunteerEntity } from '@src/domain/entities/volunteer/update-volunteer-entity';
import { hashString } from '@src/helpers/message-hashing';
import { VolunteerJWTPayload } from '@src/presentation/types/volunteer-jwt-payload';
import { JWT_SECRET_KEY } from '@src/config/server';
import { UnsecuredVolunteerAPI } from '@src/presentation/api/unsecured-volunteer';
import { ApiError } from '@src/presentation/types/api-error';

describe('Volunteer API', () => {
  let volunteerRepository: VolunteerRepository;
  let volunteerAPI: UnsecuredVolunteerAPI;
  const volunteer: VolunteerWithAuthEntity = volunteerWithAuthEntityDummy;

  class MockVolunteerRepository implements VolunteerRepository {
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
    volunteerAPI = new UnsecuredVolunteerAPI(volunteerRepository);
    jest.clearAllMocks();
  });

  it('Should check that an email exists', async () => {
    jest
      .spyOn(volunteerRepository, 'getVolunteerByEmail')
      .mockResolvedValue(volunteer);

    expect(
      volunteerAPI.checkExistingEmail(volunteer.email)
    ).resolves.not.toThrow();
  });

  it('Should throw an error when an email does not exists', async () => {
    jest
      .spyOn(volunteerRepository, 'getVolunteerByEmail')
      .mockResolvedValue(null);

    const unknowEmail = 'unknow@gmail.com';

    const expectedError = new ApiError(
      404,
      new VolunteerError({
        name: 'VOLUNTEER_NOT_FOUND',
        message: `Volunteer with email ${unknowEmail} not found`
      })
    );

    expect(volunteerAPI.checkExistingEmail(unknowEmail)).rejects.toThrow(
      expectedError
    );
  });

  it('Should login returning an access token', async () => {
    const tokenPayload: VolunteerJWTPayload = {
      idvol: volunteer.idvol,
      email: volunteer.email,
      bookPermission: volunteer.bookPermission,
      authorPermission: volunteer.authorPermission,
      certificationPermission: volunteer.certificationPermission,
      readPermission: volunteer.readPermission
    };

    jest
      .spyOn(volunteerRepository, 'getVolunteerWithAuthDataByEmail')
      .mockResolvedValue({
        ...volunteer,
        password: hashString(volunteer.password)
      });

    const tokenWrapper = await volunteerAPI.login({
      email: volunteer.email,
      password: volunteer.password
    });

    const decodedTokenPayload = verify(
      tokenWrapper.token,
      JWT_SECRET_KEY
    ) as VolunteerJWTPayload;

    expect(decodedTokenPayload.email).toEqual(tokenPayload.email);
  });

  it('Should throw an error when login with wrong password', async () => {
    jest
      .spyOn(volunteerRepository, 'getVolunteerWithAuthDataByEmail')
      .mockResolvedValue({
        ...volunteer,
        password: hashString('wrongpass')
      });

    const expectedError = new ApiError(
      400,
      new VolunteerError({
        name: 'VOLUNTEER_NOT_FOUND',
        message:
          'Could not create or update volunteer password because it was not found'
      })
    );

    expect(
      volunteerAPI.login({
        email: volunteer.email,
        password: volunteer.password
      })
    ).rejects.toThrow(expectedError);
  });

  it('Should create a volunteer and return it', async () => {
    jest
      .spyOn(volunteerRepository, 'createVolunteer')
      .mockResolvedValue(volunteer);

    const createdVolunteer = await volunteerAPI.createVolunteer(volunteer);

    expect(createdVolunteer).toEqual(volunteer);
  });

  it('Should throw an error when creating an already existing volunteer', async () => {
    const expectedError = new ApiError(
      400,
      new VolunteerError({
        name: 'VOLUNTEER_ALREADY_EXISTS',
        message: `Volunteer with email ${volunteer.email} already exists`
      })
    );

    jest
      .spyOn(volunteerRepository, 'createVolunteer')
      .mockRejectedValue(expectedError);

    expect(volunteerAPI.createVolunteer(volunteer)).rejects.toThrow(
      expectedError
    );
  });
});

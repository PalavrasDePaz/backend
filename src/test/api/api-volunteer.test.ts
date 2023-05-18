import { VolunteerRepository } from '@src/domain/interfaces/repositories/volunteer-repository';
import { VolunteerEntity } from '@src/domain/entities/volunteer-entity';
import { VolunteerAPI } from '@src/presentation/api/volunteer';
import { Response, Request } from 'express';
import { VolunteerWithAuthEntity } from '@src/domain/entities/volunteer-with-auth-entity';
import volunteerWithAuthDummy from '../dummies/volunteer-auth-entity-dummy';
import { VolunteerError } from '@src/domain/errors/volunteer';
import jwt from 'jsonwebtoken';
import { AuthError } from '@src/domain/errors/auth';
import { hashPassword } from '@src/helpers/password_hashing';
import { UpdateVolunteerEntity } from '@src/domain/entities/update-volunteer-entity';
import { TsoaResponse } from 'tsoa';

describe('Volunteer API', () => {
  let volunteerRepository: VolunteerRepository;
  let volunteerAPI: VolunteerAPI;
  const volunteer: VolunteerWithAuthEntity = volunteerWithAuthDummy;

  class MockVolunteerRepository implements VolunteerRepository {
    updateVolunteer(
      volunteer: UpdateVolunteerEntity,
      email: string
    ): Promise<VolunteerEntity | null> {
      throw new Error('Method not implemented.');
    }
    getVolunteerByEmail(email: string): Promise<VolunteerEntity | null> {
      throw new Error('Method not implemented.');
    }
    getVolunteerWithAuthDataByEmail(
      email: string
    ): Promise<VolunteerWithAuthEntity | null> {
      throw new Error('Method not implemented.');
    }
    getAllVolunteers(): Promise<VolunteerEntity[]> {
      throw new Error('Method not implemented.');
    }
    createVolunteer(
      volunteer: VolunteerWithAuthEntity
    ): Promise<VolunteerEntity> {
      throw new Error('Method not implemented.');
    }
    deleteVolunteerByEmail(email: string): Promise<boolean> {
      throw new Error('Method not implemented.');
    }
    updateOrCreatePasswordForEmail(
      email: string,
      password: string
    ): Promise<boolean> {
      throw new Error('Method not implemented.');
    }
  }

  beforeAll(() => {
    volunteerRepository = new MockVolunteerRepository();
    volunteerAPI = new VolunteerAPI(volunteerRepository);
    jest.clearAllMocks();
  });

  it('Should login returning token and status 200', async () => {
    const request = {
      body: { email: volunteer.email, password: volunteer.password }
    };
    const response = {} as unknown as Response;
    response.json = jest.fn();
    response.status = jest.fn(() => response);
    const token = 'token';

    jest.spyOn(jwt, 'sign').mockReturnValue(token as unknown as void);
    jest
      .spyOn(volunteerRepository, 'getVolunteerWithAuthDataByEmail')
      .mockResolvedValue({
        ...volunteer,
        password: hashPassword(volunteer.password)
      });

    /* await volunteerAPI.login(
      {
        email: volunteer.email,
        password: volunteer.password
      },
      () => {}
    ); */

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith({ token: 'token' });
  });

  it('Should return error and status 400 when login with wrong password', async () => {
    const request = { body: { email: volunteer.email, password: 'password' } };
    const response = {} as unknown as Response;
    response.json = jest.fn();
    response.status = jest.fn(() => response);
    const token = 'token';

    jest.spyOn(jwt, 'sign').mockReturnValue(token as unknown as void);
    jest
      .spyOn(volunteerRepository, 'getVolunteerWithAuthDataByEmail')
      .mockResolvedValue({
        ...volunteer,
        password: hashPassword(volunteer.password)
      });

    await volunteerAPI.login(
      request as unknown as TypedRequestBody<{
        email: string;
        password: string;
      }>,
      response as unknown as TypedResponse<{ token: string }, AuthError>
    );

    const error = new AuthError({
      name: 'EMAIL_OR_PASSWORD_WRONG_ERROR',
      message: 'Email or Password wrong'
    });

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith(error);
  });

  it('Should get a user by the email and return status 200', async () => {
    const request = { params: { email: volunteer.email } };
    const response = {} as unknown as Response;
    response.json = jest.fn();
    response.status = jest.fn(() => response);

    jest
      .spyOn(volunteerRepository, 'getVolunteerByEmail')
      .mockResolvedValue(volunteer);

    await volunteerAPI.getVolunteerByEmail(
      request as unknown as TypedRequestParams<{ email: string }>,
      response as unknown as TypedResponse<VolunteerEntity, VolunteerError>
    );

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith(volunteer);
  });

  it('Should return 400 if volunteer does not exists', async () => {
    const request = { params: { email: 'unexisting@email.com' } };
    const response = {} as unknown as Response;
    response.json = jest.fn();
    response.status = jest.fn(() => response);
    const result = new VolunteerError({
      name: 'VOLUNTEER_NOT_FOUND',
      message: `Volunteer with email unexisting@email.com not found`
    });

    jest
      .spyOn(volunteerRepository, 'getVolunteerByEmail')
      .mockResolvedValue(null);

    await volunteerAPI.getVolunteerByEmail(
      request as unknown as TypedRequestParams<{ email: string }>,
      response as unknown as TypedResponse<VolunteerEntity, VolunteerError>
    );

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith(result);
  });

  it('Should get all volunteers and return status 200', async () => {
    const volunteers: VolunteerWithAuthEntity[] = [volunteerWithAuthDummy];
    const response = {} as unknown as Response;
    response.json = jest.fn();
    response.status = jest.fn(() => response);

    jest
      .spyOn(volunteerRepository, 'getAllVolunteers')
      .mockResolvedValue(volunteers);

    await volunteerAPI.getAllVolunteers(
      {} as Request,
      response as unknown as TypedResponse<VolunteerEntity[], VolunteerError>
    );

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith(volunteers);
  });

  it('Should return the created volunteer and status 201', async () => {
    const request = { body: volunteer };
    const response = {} as unknown as Response;
    response.json = jest.fn();
    response.status = jest.fn(() => response);

    jest
      .spyOn(volunteerRepository, 'createVolunteer')
      .mockResolvedValue(volunteer);

    await volunteerAPI.createVolunteer(
      request as Request,
      response as unknown as TypedResponse<VolunteerEntity, VolunteerError>
    );

    expect(response.status).toHaveBeenCalledWith(201);
    expect(response.json).toHaveBeenCalledWith(volunteer);
  });

  it('Should return error and status 400 if email already exists', async () => {
    const request = { body: volunteer };
    const response = {} as unknown as Response;
    response.json = jest.fn();
    response.status = jest.fn(() => response);
    const error = new VolunteerError({
      name: 'VOLUNTEER_ALREADY_EXISTS',
      message: `Volunteer with email ${volunteer.email} already exists`
    });

    jest.spyOn(volunteerRepository, 'createVolunteer').mockRejectedValue(error);

    await volunteerAPI.createVolunteer(
      request as Request,
      response as unknown as TypedResponse<VolunteerEntity, VolunteerError>
    );

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith(error);
  });

  it('Should create or update password and return status 204', async () => {
    const request = {
      params: { email: volunteer.email },
      body: { password: volunteer.password }
    };
    const response = {} as unknown as Response;
    response.json = jest.fn();
    response.status = jest.fn(() => response);

    jest
      .spyOn(volunteerRepository, 'updateOrCreatePasswordForEmail')
      .mockResolvedValue(true);

    await volunteerAPI.createOrUpdatePassword(
      request as TypedRequest<{ email: string }, { password: string }>,
      response as unknown as TypedResponse<null, VolunteerError>
    );

    expect(response.status).toHaveBeenCalledWith(204);
  });

  it('Should return error and status 400 if volunteer is not found', async () => {
    const request = {
      params: { email: volunteer.email },
      body: { password: volunteer.password }
    };
    const response = {} as unknown as Response;
    response.json = jest.fn();
    response.status = jest.fn(() => response);

    jest
      .spyOn(volunteerRepository, 'updateOrCreatePasswordForEmail')
      .mockResolvedValue(false);

    await volunteerAPI.createOrUpdatePassword(
      request as TypedRequest<{ email: string }, { password: string }>,
      response as unknown as TypedResponse<null, VolunteerError>
    );

    const error = new VolunteerError({
      name: 'VOLUNTEER_NOT_FOUND',
      message:
        'Could not create or update volunteer password because it was not found'
    });

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith(error);
  });

  it('Should delete volunteer and return status 204', async () => {
    const request = { params: { email: volunteer.email } };
    const response = {} as unknown as Response;
    response.json = jest.fn();
    response.status = jest.fn(() => response);

    jest
      .spyOn(volunteerRepository, 'deleteVolunteerByEmail')
      .mockResolvedValue(true);

    await volunteerAPI.deleteVolunteer(
      request as TypedRequestParams<{ email: string }>,
      response as unknown as TypedResponse<null, VolunteerError>
    );

    expect(response.status).toHaveBeenCalledWith(204);
  });

  it('Should return error and status 400 if volunteer to delete is not found', async () => {
    const request = { params: { email: volunteer.email } };
    const response = {} as unknown as Response;
    response.json = jest.fn();
    response.status = jest.fn(() => response);

    jest
      .spyOn(volunteerRepository, 'deleteVolunteerByEmail')
      .mockResolvedValue(false);

    await volunteerAPI.deleteVolunteer(
      request as TypedRequestParams<{ email: string }>,
      response as unknown as TypedResponse<null, VolunteerError>
    );

    const error = new VolunteerError({
      name: 'VOLUNTEER_NOT_DELETED',
      message: `Volunteer with email ${volunteer.email} not deleted`
    });

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith(error);
  });
});

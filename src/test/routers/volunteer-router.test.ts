import { VolunteerRepository } from '@src/domain/interfaces/repositories/volunteer-repository';
import { VolunteerEntity } from '@src/domain/entities/volunteer-entity';
import { VolunteerAPI } from '@src/presentation/api/volunteer';
import {
  Application,
  NextFunction,
  Request,
  Response,
  RequestHandler
} from 'express';
import { App } from '@src/app';
import volunteerRoutes from '@src/presentation/routers/volunteer/volunteer';
import request from 'supertest';
import { UpdateVolunteerEntity } from '@src/domain/entities/update-volunteer-entity';
import { VolunteerWithAuthEntity } from '@src/domain/entities/volunteer-with-auth-entity';

describe('Volunteer Router', () => {
  class MockVolunteerRepository implements VolunteerRepository {
    getVolunteerWithAuthDataByEmail(
      _email: string
    ): Promise<VolunteerWithAuthEntity> {
      throw new Error('Method not implemented.');
    }
    createPasswordForEmail(email: string): Promise<void> {
      throw new Error('Method not implemented.');
    }
    updateVolunteer(
      _volunteer: UpdateVolunteerEntity,
      _email: string
    ): Promise<VolunteerEntity> {
      throw new Error('Method not implemented.');
    }
    async getVolunteerByEmail(_email: string): Promise<VolunteerEntity> {
      throw new Error('Method not implemented.');
    }
    getAllVolunteers(): Promise<VolunteerEntity[]> {
      throw new Error('Method not implemented.');
    }
    createVolunteer(_volunteer: VolunteerEntity): Promise<VolunteerEntity> {
      throw new Error('Method not implemented.');
    }
    deleteVolunteerByEmail(_email: string): Promise<void> {
      throw new Error('Method not implemented.');
    }
  }

  const stubAuthMiddleware: RequestHandler = (
    _req: Request,
    _res: Response,
    next: NextFunction
  ) => {
    next();
  };

  let app: Application;
  let volunteerRepository: VolunteerRepository;
  beforeAll(() => {
    volunteerRepository = new MockVolunteerRepository();
    const volunteerAPI = new VolunteerAPI(volunteerRepository);
    app = new App(volunteerRoutes(volunteerAPI)).server;
  });

  it('Should get a user by the email and return status 200', async () => {
    const volunteer: VolunteerEntity = {
      email: 'test@gmail.com',
      name: 'test',
      // idvol: 0,
      // password: '',
      birthDate: new Date(),
      phoneNumber: '',
      country: '',
      state: '',
      city: '',
      ethnicity: '',
      gender: '',
      howFoundPep: '',
      knowledgePep: '',
      workshops: [],
      schooling: '',
      studiesKnowlegde: '',
      lifeExperience: '',
      desires: '',
      rolesPep: [],
      weekAvailability: 0,
      meetingAvailability: '',
      contribution: '',
      needDeclaration: false
    };

    jest
      .spyOn(volunteerRepository, 'getVolunteerByEmail')
      .mockImplementation(async (_: string): Promise<VolunteerEntity> => {
        return volunteer;
      });

    const response = await request(app).get(`/${volunteer.email}`);

    expect(response.status).toBe(200);
    expect(response.body.volunteer).toEqual(volunteer);
  });
});